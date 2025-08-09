import { Service } from "typedi";
import { UserRepository } from "./Repository";
import bcrypt from "bcrypt";
import { UserError } from "./../../middleware/error/userError";
import { IInteractor } from "./interface/IInteractor";
import { UserAuth } from "../../../database/schema/user";
import { UserLoginParams, UserRegisterParams, GetUsersQuery } from "./validate";

@Service()
export class UserInteractor implements IInteractor {
  constructor(private repository: UserRepository) { }

  async loginUser(user: UserLoginParams) {
    const userDb = await this.repository.getUserByEmail(user.email);

    if (!userDb) {
      throw UserError.invalidPasswordOrEmail();
    }

    const isMatch = await bcrypt.compare(user.password, userDb.password);

    if (!isMatch) {
      throw UserError.invalidPasswordOrEmail();
    }

    return userDb;
  }

  async registerUser(user: UserRegisterParams) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.repository.createUser(user, hashedPassword);
    return newUser;
  }

  async getUserMe(user: UserAuth) {
    const currentUser = await this.repository.getUserById(user.id);
    if (!currentUser) {
      throw UserError.notFound();
    }
    return currentUser;
  }

  async getUsers(filters: GetUsersQuery) {
    return this.repository.getUsers(filters);
  }
}
