import { User } from "../../../database/schema/user";
import { UserRegisterParams } from "../validate";

export interface IRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: UserRegisterParams, hashedPassword: string): Promise<User>;
  getUserById(id: string): Promise<User | null>;
}