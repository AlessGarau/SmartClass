import { ClassMessage } from "../../feature/class/message";
import { RoomMessage } from "../../feature/room/message";
import { UserMessage } from "../../feature/user/message";
import { WeatherMessage } from "../../feature/weather/message";
import { MqttMessage } from "../../services/message";
import { PlanningMessage } from "../../feature/planning/message";

export const ErrorMessageEnum = {
  General: {
    NOT_FOUND: "Resource wasn't found",
  },
  Room: {
    ...RoomMessage,
  },
  Class: {
    ...ClassMessage,
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
  Planning: {
    ...PlanningMessage,
  },
} as const;
