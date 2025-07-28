import { Service } from "typedi";
import type { IPlanningInteractor, WeeklyPlanningFilters } from "./interface/IInteractor";
import { PlanningError } from "./../../middleware/error/planningError";
import { RoomRepository } from "../room/Repository";
import { LessonRepository } from "../lesson/Repository";
import { ClassRepository } from "../class/Repository";
import { RoomError } from "../../middleware/error/roomError";
import { LessonError } from "../../middleware/error/lessonError";
import { WeeklyPlanningData } from "./validate";
import { readFileSync } from "fs";
import { join } from "path";

@Service()
export class PlanningInteractor implements IPlanningInteractor {
  constructor(
    private roomRepository: RoomRepository,
    private lessonRepository: LessonRepository,
    private classRepository: ClassRepository,
  ) { }

  async getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningData> {
    const { startDate, endDate } = this.getWeekDateRange(filters.weekNumber, filters.year);

    const lessons = await this.lessonRepository.getLessonsForWeek(startDate, endDate);

    if (!lessons) {
      throw LessonError.notFound();
    }

    let rooms = await this.roomRepository.getRooms({
      filter: {
        isEnabled: true,
      },
    });

    if (!rooms) {
      throw RoomError.notFound();
    }

    if (filters.building || filters.floor !== undefined) {
      rooms = rooms.filter(room => {
        if (filters.building && room.building !== filters.building) {
          return false;
        }
        if (filters.floor !== undefined && room.floor !== filters.floor) {
          return false;
        }
        return true;
      });
    }

    return {
      lessons,
      rooms,
      weekNumber: filters.weekNumber,
      year: filters.year,
    };
  }

  private getWeekDateRange(weekNumber: number, year: number): { startDate: Date; endDate: Date } {
    const firstDayOfYear = new Date(year, 0, 1);

    const firstMonday = new Date(firstDayOfYear);
    const dayOfWeek = firstMonday.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    firstMonday.setDate(firstMonday.getDate() + daysUntilMonday);

    const startDate = new Date(firstMonday);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 4);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  async getLessonTemplate(): Promise<string> {
    try {
      const templatePath = join(__dirname, "../../templates/lesson_import_template.csv");
      const templateContent = readFileSync(templatePath, "utf-8");
      return templateContent;
    } catch (error) {
      throw PlanningError.templateRetrievalFailed(error as Error);
    }
  }
}