import { ErrorMessageEnum } from "./constant";

export class RoomError extends Error {
  public readonly statusCode: number;
  public readonly name: string;
  public readonly cause?: Error;

  public constructor(errorParams: {
    message?: string;
    statusCode?: number;
    cause?: Error;
  }) {
    const { message, statusCode, cause } = errorParams;
    super(message || ErrorMessageEnum.Room.CREATION_FAILED);
    this.statusCode = statusCode || 500;
    this.name = "RoomError";
    this.cause = cause;
  }

  static notFound(message?: string): RoomError {
    return new RoomError({
      message: message || ErrorMessageEnum.Room.NOT_FOUND,
      statusCode: 404,
    });
  }

  static creationFailed(message?: string, cause?: Error): RoomError {
    return new RoomError({
      message: message || ErrorMessageEnum.Room.CREATION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static alreadyExists(message?: string): RoomError {
    return new RoomError({
      message: message || ErrorMessageEnum.Room.ALREADY_EXISTS,
      statusCode: 409,
    });
  }
} 