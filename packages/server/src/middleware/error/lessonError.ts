import { ErrorMessageEnum } from "./constant";

export class LessonError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  constructor(errorParams: { message?: string; statusCode?: number; cause?: Error }) {
    const { message = ErrorMessageEnum.Planning.OPTIMIZATION_FAILED, statusCode = 500, cause } = errorParams;
    super(message);
    this.name = "LessonError";
    this.statusCode = statusCode;
    this.cause = cause;
  }

  static notFound(cause?: Error): LessonError {
    return new LessonError({
      message: ErrorMessageEnum.Planning.PLANNING_NOT_FOUND,
      statusCode: 404,
      cause,
    });
  }
}