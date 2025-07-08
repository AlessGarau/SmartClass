import { User } from "../../../database/schema/user";

export interface IRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string, password: string, first_name: string, last_name: string, role: "teacher" | "admin"): Promise<User>;
}