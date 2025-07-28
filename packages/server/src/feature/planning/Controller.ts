import { Service } from "typedi";
import type { FastifyReply, FastifyRequest } from "fastify";
import { PlanningInteractor } from "./Interactor";
import { PlanningMapper } from "./Mapper";
import {
  WeeklyPlanningParamsSchema,
  WeeklyPlanningQuerySchema,
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
    try {
      const { weekNumber } = WeeklyPlanningParamsSchema.parse(request.params);

      const query = WeeklyPlanningQuerySchema.parse(request.query);
      const year = query.year || new Date().getFullYear();

      const planningResult = await this.planningInteractor.getWeeklyPlanning({
        weekNumber,
        year,
        building: query.building,
        floor: query.floor,
      });

      const planningData = this.planningMapper.toWeekPlanningData(
        planningResult.lessons,
        planningResult.rooms,
        planningResult.weekNumber,
        planningResult.year,
      );

      return reply.status(200).send({
        data: planningData,
        message: PlanningMessage.PLANNING_RETRIEVED_SUCCESSFULLY,
      });
    } catch (error) {
      if (error instanceof PlanningError) {
        throw error;
      }
      throw PlanningError.notFound(error as Error);
    }
  }

  async downloadLessonTemplate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const templateContent = await this.planningInteractor.getLessonTemplate();

      return reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", "attachment; filename=lesson_import_template.csv")
        .send(templateContent);
    } catch (error) {
      if (error instanceof PlanningError) {
        throw error;
      }
      throw PlanningError.templateRetrievalFailed(error as Error);
    }
  }
}