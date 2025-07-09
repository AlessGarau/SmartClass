import { Service } from "typedi";
import { User, UserRegister } from "../../database/schema/user";
import { UserResponse, UserLoginResponse } from "./interface/IResponse";
import { UserRegisterSchema } from "./validate";
import { z } from "zod";

@Service()
export class UserResponseMapper {
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

@Service()
export class UserDatabaseMapper {
  toUser(user: z.infer<typeof UserRegisterSchema>): UserRegister {
    const userRegister: UserRegister = {
      email: user.email,
      password: user.password,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
    };
    return userRegister;
  }
}