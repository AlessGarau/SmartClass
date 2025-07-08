import { User } from "../../../database/schema/user";

export interface IInteractor {
  loginUser(email: string, password: string): Promise<User>;
  registerUser(email: string, password: string, first_name: string, last_name: string, role: "teacher" | "admin"): Promise<User>;
}