import { RoomMessage } from "../../feature/room/message";
import { UserMessage } from "../../feature/user/message";
import { WeatherMessage } from "../../feature/weather/message";
import { MqttMessage } from "../../services/message";

export const ErrorMessageEnum = {
  General: {
    NOT_FOUND: "Resource wasn't found",
  },
  Room: {
    ...RoomMessage,
  },
  User: {
    ...UserMessage,
  },
  Weather: {
    ...WeatherMessage,
  },
  Mqtt: {
    ...MqttMessage,
  },
} as const;
