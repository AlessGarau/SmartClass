
export class LessonError extends Error {
  public readonly statusCode: number;
  public readonly cause?: Error;

  constructor(errorParams: { message?: string; statusCode?: number; cause?: Error }) {
    const { message = "Lesson operation failed", statusCode = 500, cause } = errorParams;
    super(message);
    this.name = "LessonError";
    this.statusCode = statusCode;
    this.cause = cause;
  }

  static notFound(cause?: Error): LessonError {
    return new LessonError({
      message: "Lesson not found",
      statusCode: 404,
      cause,
    });
  }

  static teacherNotAvailable(cause?: Error): LessonError {
    return new LessonError({
      message: "Le professeur a déjà un cours à cette heure",
      statusCode: 409,
      cause,
    });
  }
}