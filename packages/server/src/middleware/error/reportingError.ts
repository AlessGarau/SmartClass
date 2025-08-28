import { ErrorMessageEnum } from "./constant";

export class ReportingError extends Error {
  public readonly statusCode: number;
  public readonly name: string;
  public readonly cause?: Error;

  public constructor(errorParams: {
    message?: string;
    statusCode?: number;
    cause?: Error;
  }) {
    const { message, statusCode, cause } = errorParams;
    super(message || ErrorMessageEnum.Teacher.CREATION_FAILED);
    this.statusCode = statusCode || 500;
    this.name = "TeacherError";
    this.cause = cause;
  }

  static notFound(message?: string): ReportingError {
    return new ReportingError({
      message: message || ErrorMessageEnum.Teacher.NOT_FOUND,
      statusCode: 404,
    });
  }

  static creationFailed(message?: string, cause?: Error): ReportingError {
    return new ReportingError({
      message: message || ErrorMessageEnum.Teacher.CREATION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static updateFailed(message?: string, cause?: Error): ReportingError {
    return new ReportingError({
      message: message || ErrorMessageEnum.Teacher.UPDATE_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static alreadyExists(message?: string): ReportingError {
    return new ReportingError({
      message: message || ErrorMessageEnum.Teacher.ALREADY_EXISTS,
      statusCode: 409,
    });
  }
} 