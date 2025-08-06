import { Service } from "typedi";
import type { FastifyReply, FastifyRequest } from "fastify";
import { PlanningInteractor } from "./Interactor";
import { PlanningMapper } from "./Mapper";
import {
  WeeklyPlanningQuerySchema,
  FileUploadSchema,
  DeleteLessonParamsSchema,
} from "./validate";
import { PlanningMessage } from "./message";
import { PlanningError } from "./../../middleware/error/planningError";

@Service()
export class PlanningController {
  constructor(
    private planningInteractor: PlanningInteractor,
    private planningMapper: PlanningMapper,
  ) { }

  async getWeeklyPlanning(request: FastifyRequest, reply: FastifyReply) {
    const query = WeeklyPlanningQuerySchema.parse(request.query);
    const year = query.year || new Date().getFullYear();

    const planningResult = await this.planningInteractor.getWeeklyPlanning({
      startDate: query.startDate,
      endDate: query.endDate,
      year,
      building: query.building,
      floor: query.floor,
    });

    const planningData = this.planningMapper.toWeekPlanningData(
      planningResult.lessons,
      planningResult.rooms,
      planningResult.startDate,
      planningResult.endDate,
      planningResult.year,
    );

    return reply.status(200).send({
      data: planningData,
      message: PlanningMessage.PLANNING_RETRIEVED_SUCCESSFULLY,
    });
  }

  async downloadLessonTemplate(request: FastifyRequest, reply: FastifyReply) {
    const templateContent = await this.planningInteractor.getLessonTemplate();

    return reply
      .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .header("Content-Disposition", "attachment; filename=lesson_import_template.xlsx")
      .send(templateContent);
  }

  async importLessonTemplate(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      throw PlanningError.invalidFileUpload();
    }

    const buffer = await data.toBuffer();

    const validatedFile = FileUploadSchema.parse({
      filename: data.filename,
      mimetype: data.mimetype,
      file: buffer,
    });

    const importResult = await this.planningInteractor.importLessonsFromTemplate(validatedFile.file);

    return reply.status(200).send({
      message: PlanningMessage.LESSONS_IMPORTED_SUCCESSFULLY,
      importedCount: importResult.importedCount,
      skippedCount: importResult.skippedCount,
      errors: importResult.errors,
    });

  }

  async getFilterOptions(_request: FastifyRequest, reply: FastifyReply) {
    const filterOptions = await this.planningInteractor.getFilterOptions();

    return reply.status(200).send({
      data: filterOptions,
      message: PlanningMessage.FILTER_OPTIONS_RETRIEVED_SUCCESSFULLY,
    });
  }

  async deleteLesson(request: FastifyRequest, reply: FastifyReply) {
    const { lessonId } = DeleteLessonParamsSchema.parse(request.params);

    await this.planningInteractor.deleteLesson(lessonId);

    return reply.status(200).send({
      message: PlanningMessage.LESSON_DELETED_SUCCESSFULLY,
    });
  }
}