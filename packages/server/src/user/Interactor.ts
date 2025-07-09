import { Service } from "typedi";   
import { UserRepository } from "./Repository";
import bcrypt from "bcrypt";
import { UserError } from "../error/userError";
import { IInteractor } from "./interface/IInteractor";
<<<<<<< HEAD
import { UserAuth } from "../../database/schema/user";
=======
import {UserAuth } from "../../database/schema/user";
>>>>>>> ae0be69 (ADD login for mobile with device token and refresh token)

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

  async registerUser(email: string, password: string, firstName: string, lastName: string, role: "teacher" | "admin") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repository.createUser(email, hashedPassword, firstName, lastName, role);
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