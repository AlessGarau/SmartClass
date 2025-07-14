import { RoomMessage } from "../../feature/room/message";
import { UserMessage } from "../../feature/user/message";

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
} as const;
