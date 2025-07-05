import { ErrorMessageEnum } from "./constant";

export default class NotFoundError extends Error {
  private static readonly _defaultCode: 404;
  public readonly code: number;

  public constructor(errorParams: { message?: string; code?: number }) {
    const { message, code } = errorParams;

    super(message || ErrorMessageEnum.General.NOT_FOUND);
    this.code =  NotFoundError._defaultCode;
  }
}
