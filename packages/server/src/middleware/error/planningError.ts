import { ErrorMessageEnum } from "./constant";

export class PlanningError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  constructor(errorParams: { message?: string; statusCode?: number; cause?: Error }) {
    const { message = "Planning operation failed", statusCode = 500, cause } = errorParams;
    super(message);
    this.name = "PlanningError";
    this.statusCode = statusCode;
    this.cause = cause;
  }

  static invalidFileUpload(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.INVALID_FILE_UPLOAD,
      statusCode: 400,
      cause,
    });
  }

  static invalidFileFormat(message?: string, cause?: Error): PlanningError {
    return new PlanningError({
      message: message || ErrorMessageEnum.Planning.INVALID_FILE_FORMAT,
      statusCode: 400,
      cause,
    });
  }

}