import { ErrorMessageEnum } from "./constant";

export class PlanningError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  constructor(errorParams: { message?: string; statusCode?: number; cause?: Error }) {
    const { message = ErrorMessageEnum.Planning.OPTIMIZATION_FAILED, statusCode = 500, cause } = errorParams;
    super(message);
    this.name = "PlanningError";
    this.statusCode = statusCode;
    this.cause = cause;
  }

  static notFound(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.PLANNING_NOT_FOUND,
      statusCode: 404,
      cause,
    });
  }

  static invalidWeekNumber(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.INVALID_WEEK_NUMBER,
      statusCode: 400,
      cause,
    });
  }

  static invalidYear(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.INVALID_YEAR,
      statusCode: 400,
      cause,
    });
  }

  static optimizationFailed(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.OPTIMIZATION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static environmentalDataUnavailable(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.ENVIRONMENTAL_DATA_UNAVAILABLE,
      statusCode: 503,
      cause,
    });
  }

  static templateRetrievalFailed(cause?: Error): PlanningError {
    return new PlanningError({
      message: ErrorMessageEnum.Planning.TEMPLATE_RETRIEVAL_FAILED,
      statusCode: 500,
      cause,
    });
  }
}