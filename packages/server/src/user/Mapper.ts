import { Service } from "typedi";
import { User, UserRegister } from "../../database/schema/user";
import { UserFullResponse, UserMeResponse, UserRegisterParams } from "./validate";

@Service()
export class UserResponseMapper {
  toResponse(user: User): UserFullResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    };
  }

  toLoginResponse(user: User): UserMeResponse {
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
  toUser(user: UserRegisterParams): UserRegister {
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
