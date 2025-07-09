import { Service } from "typedi";
import { User } from "../../database/schema/user";
import { UserResponse, UserLoginResponse } from "./interface/IResponse";

@Service()
export class UserMapper {
  toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  toLoginResponse(user: User): UserLoginResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };
  }

}