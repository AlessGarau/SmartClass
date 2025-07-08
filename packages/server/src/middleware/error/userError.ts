import { ErrorMessageEnum } from "./constant";

export class UserError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  public constructor(errorParams: { 
    message?: string; 
    statusCode?: number;
    cause?: Error;
  }) {
    const { statusCode, cause } = errorParams;
    super(ErrorMessageEnum.User.REGISTER_FAILED);
    this.statusCode = statusCode || 500;
    this.name = "UserError";
    this.cause = cause;
  }

  static notFound(message?: string): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.NOT_FOUND,
      statusCode: 404,
    });
  }

  static loginFailed(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.LOGIN_ERROR,
      statusCode: 500,
      cause,
    });
  }

  static invalidPasswordOrEmail(message?: string): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.PASSWORD_OR_EMAIL_INVALID,
      statusCode: 401,
    });
  }

  static registerFailed(message?: string): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.REGISTER_FAILED,
      statusCode: 500,
    });
  }
} 
