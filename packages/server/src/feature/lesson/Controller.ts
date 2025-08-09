import { Service } from "typedi";
import type { FastifyReply, FastifyRequest } from "fastify";
import { LessonInteractor } from "./Interactor";
import {
  LessonIdParamsSchema,
  UpdateLessonBodySchema,
  type UpdateLessonBody,
  type LessonIdParams,
} from "./validate";
import { LessonMessage } from "./message";

@Service()
export class LessonController {
  constructor(
    private lessonInteractor: LessonInteractor,
  ) { }

  async updateLesson(
    request: FastifyRequest<{ Params: LessonIdParams; Body: UpdateLessonBody }>,
    reply: FastifyReply,
  ) {
    const { lessonId } = LessonIdParamsSchema.parse(request.params);
    const lessonData = UpdateLessonBodySchema.parse(request.body);

    const updatedLesson = await this.lessonInteractor.updateLesson(lessonId, lessonData);

    return reply.status(200).send({
      message: LessonMessage.LESSON_UPDATED_SUCCESSFULLY,
      data: updatedLesson,
    });
  }

  async deleteLesson(
    request: FastifyRequest<{ Params: LessonIdParams }>,
    reply: FastifyReply,
  ) {
    const { lessonId } = LessonIdParamsSchema.parse(request.params);

    await this.lessonInteractor.deleteLesson(lessonId);

    return reply.status(200).send({
      message: LessonMessage.LESSON_DELETED_SUCCESSFULLY,
    });
  }
}