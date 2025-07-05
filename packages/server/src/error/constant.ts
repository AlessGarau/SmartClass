import { SalleMessage } from "../salles/mssage";

export const ErrorMessageEnum = {
  General: {
    NOT_FOUND: "Resource wasn't found",
  },
  Salle : {
    ...SalleMessage
  },
} as const;