import { ErrorMessageEnum } from "./constant";

export class MqttError extends Error {
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
    this.name = "MqttError";
    this.cause = cause;
  }

  static connectionFailed(cause?: Error): MqttError {
    return new MqttError({
      message: ErrorMessageEnum.Mqtt.CONNECTION_FAILED,
      statusCode: 503,
      cause,
    });
  }

  static subscriptionFailed(topic: string, cause?: Error): MqttError {
    return new MqttError({
      message: `${ErrorMessageEnum.Mqtt.SUBSCRIPTION_FAILED}: ${topic}`,
      statusCode: 500,
      cause,
    });
  }

  static messageParsingFailed(topic: string, cause?: Error): MqttError {
    return new MqttError({
      message: `${ErrorMessageEnum.Mqtt.MESSAGE_PARSING_FAILED}: ${topic}`,
      statusCode: 400,
      cause,
    });
  }

  static dataCollectionFailed(cause?: Error): MqttError {
    return new MqttError({
      message: ErrorMessageEnum.Mqtt.DATA_COLLECTION_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static dataInsertionFailed(sensorType: string, cause?: Error): MqttError {
    return new MqttError({
      message: `${ErrorMessageEnum.Mqtt.DATA_INSERTION_FAILED}: ${sensorType}`,
      statusCode: 500,
      cause,
    });
  }

  static serviceStartFailed(cause?: Error): MqttError {
    return new MqttError({
      message: ErrorMessageEnum.Mqtt.SERVICE_START_FAILED,
      statusCode: 503,
      cause,
    });
  }

  static serviceStopFailed(cause?: Error): MqttError {
    return new MqttError({
      message: ErrorMessageEnum.Mqtt.SERVICE_STOP_FAILED,
      statusCode: 500,
      cause,
    });
  }

  static invalidBrokerUrl(brokerUrl: string): MqttError {
    return new MqttError({
      message: `${ErrorMessageEnum.Mqtt.INVALID_BROKER_URL}: ${brokerUrl}`,
      statusCode: 400,
    });
  }

  static timeoutError(cause?: Error): MqttError {
    return new MqttError({
      message: ErrorMessageEnum.Mqtt.TIMEOUT_ERROR,
      statusCode: 504,
      cause,
    });
  }
} 