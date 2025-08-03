import { ErrorMessageEnum } from "./constant";

export class ClassError extends Error {
  public readonly statusCode: number;
  public readonly name: string;
  public readonly cause?: Error;

  public constructor(errorParams: {
    message?: string;
    statusCode?: number;
    cause?: Error;
  }) {
    const { message, statusCode, cause } = errorParams;
    super(message || ErrorMessageEnum.Class.CREATION_FAILED);
    this.statusCode = statusCode || 500;
    this.name = "ClassError";
    this.cause = cause;
  }

  static notFound(message?: string): ClassError {
    return new ClassError({
      message: message || ErrorMessageEnum.Class.NOT_FOUND,
      statusCode: 404,
    });
  }

  static creationFailed(message?: string, cause?: Error): ClassError {
    return new ClassError({
      message: message || ErrorMessageEnum.Class.CREATION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static updateFailed(message?: string, cause?: Error): ClassError {
    return new ClassError({
      message: message || ErrorMessageEnum.Class.UPDATE_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static alreadyExists(message?: string): ClassError {
    return new ClassError({
      message: message || ErrorMessageEnum.Class.ALREADY_EXISTS,
      statusCode: 409,
    });
  }
} 