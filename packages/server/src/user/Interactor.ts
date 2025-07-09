import { Service } from "typedi";   
import { UserRepository } from "./Repository";
import bcrypt from "bcrypt";
import { UserError } from "../error/userError";
import { IInteractor } from "./interface/IInteractor";
import { UserAuth } from "../../database/schema/user";

@Service()
export class UserInteractor implements IInteractor {
  constructor(private repository: UserRepository) {}

  async loginUser(email: string, password: string) {
    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      throw UserError.invalidPasswordOrEmail();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw UserError.invalidPasswordOrEmail();
    }

    return user;
  }

  async registerUser(email: string, password: string, first_name: string, last_name: string, role: "teacher" | "admin") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repository.createUser(email, hashedPassword, first_name, last_name, role);
    return user;
  }

  async getUserMe(user: UserAuth) {
    const currentUser = await this.repository.getUserById(user.id);
    if (!currentUser) {
      throw UserError.notFound();
    }
    return currentUser;
  }
}