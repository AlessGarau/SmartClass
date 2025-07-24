import { ErrorMessageEnum } from "./constant";

export class WeatherError extends Error {
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
    this.name = "WeatherError";
    this.cause = cause;
  }

  static apiFetchFailed(cause?: Error): WeatherError {
    return new WeatherError({
      message: ErrorMessageEnum.Weather.API_FETCH_FAILED,
      statusCode: 503,
      cause,
    });
  }

  static noDataAvailable(cause?: Error): WeatherError {
    return new WeatherError({
      message: ErrorMessageEnum.Weather.NO_DATA_AVAILABLE,
      statusCode: 404,
      cause,
    });
  }

  static serviceUnavailable(cause?: Error): WeatherError {
    return new WeatherError({
      message: ErrorMessageEnum.Weather.SERVICE_UNAVAILABLE,
      statusCode: 503,
      cause,
    });
  }

  static invalidLocation(cause?: Error): WeatherError {
    return new WeatherError({
      message: ErrorMessageEnum.Weather.INVALID_LOCATION,
      statusCode: 400,
      cause,
    });
  }
} 