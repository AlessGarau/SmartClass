import { SalleMessage } from "../../feature/room/message";
import { UserMessage } from "../../feature/user/message";
import { WeatherMessage } from "../../feature/weather/message";

export const ErrorMessageEnum = {
  General: {
    NOT_FOUND: "Resource wasn't found",
  },
  Salle: {
    ...SalleMessage,
  },
  User: {
    ...UserMessage,
  },
  Weather: {
    ...WeatherMessage,
  },
} as const;
