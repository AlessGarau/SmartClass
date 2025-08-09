import { User, UserAuth } from "../../../../database/schema/user";
import { UserLoginParams, UserRegisterParams, GetUsersQuery } from "../validate";

export interface IInteractor {
  loginUser(user: UserLoginParams): Promise<User>;
  registerUser(user: UserRegisterParams): Promise<User>;
  getUserMe(user: UserAuth): Promise<User>;
  getUsers(filters: GetUsersQuery): Promise<User[]>;
}