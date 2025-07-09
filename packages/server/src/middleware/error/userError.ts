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
    super(errorParams.message);
    this.statusCode = statusCode || 500;
    this.name = "UserError";
    this.cause = cause;
  }

  static notFound(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.NOT_FOUND,
      statusCode: 404,
      cause: cause,
    });
  }

  static loginFailed(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.LOGIN_ERROR,
      statusCode: 500,
      cause,
    });
  }

  static invalidPasswordOrEmail(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.PASSWORD_OR_EMAIL_INVALID,
      statusCode: 401,
      cause,
    });
  }

  static registerFailed(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.REGISTER_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static unauthorizedAccess(cause?: Error): UserError {
    return new UserError({
      message: ErrorMessageEnum.User.UNAUTHORIZED_ACCESS,
      statusCode: 403,
      cause,
    });
  }
} 
