import { ClassMessage } from "../../feature/class/message";
import { PlanningMessage } from "../../feature/planning/message";
import { RoomMessage } from "../../feature/room/message";
import { TeacherMessage } from "../../feature/teacher/message";
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
  Class: {
    ...ClassMessage,
  },
  Teacher: {
    ...TeacherMessage,
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
