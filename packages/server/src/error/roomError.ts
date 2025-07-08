import { ErrorMessageEnum } from "./constant";

export class RoomError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  public constructor(errorParams: { 
    message?: string; 
    statusCode?: number;
    cause?: Error;
  }) {
    const { statusCode, cause } = errorParams;
    super(ErrorMessageEnum.Salle.CREATION_FAILED);
    this.statusCode = statusCode || 500;
    this.name = "RoomError";
    this.cause = cause;
  }

  static notFound(message?: string): RoomError {
    return new RoomError({
      message: ErrorMessageEnum.Salle.NOT_FOUND,
      statusCode: 404,
    });
  }

  static creationFailed(message?: string, cause?: Error): RoomError {
    return new RoomError({
      message: ErrorMessageEnum.Salle.CREATION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static alreadyExists(message?: string): RoomError {
    return new RoomError({
      message: ErrorMessageEnum.Salle.ALREADY_EXISTS,
      statusCode: 409,
    });
  }
} 