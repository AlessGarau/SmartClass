import { Service } from "typedi";
import type { IPlanningInteractor, WeeklyPlanningResult, WeeklyPlanningFilters } from "./interface/IInteractor";
import { PlanningRepository } from "./Repository";
import { EnvironmentalDataService } from "./services/EnvironmentalDataService";
import { PlanningOptimizer } from "./services/PlanningOptimizer";
import { PlanningError } from "./../../middleware/error/planningError";
import { RoomRepository } from "../room/Repository";
import { LessonRepository } from "../lesson/Repository";
import { ClassRepository } from "../class/Repository";

@Service()
export class PlanningInteractor implements IPlanningInteractor {
  constructor(
    private planningRepository: PlanningRepository,
    private roomRepository: RoomRepository,
    private lessonRepository: LessonRepository,
    private classRepository: ClassRepository,
    private environmentalDataService: EnvironmentalDataService,
    private planningOptimizer: PlanningOptimizer,
  ) { }

  async getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningResult> {
    try {
      const { startDate, endDate } = this.getWeekDateRange(filters.weekNumber, filters.year);

      // Get lessons for the week
      const lessons = await this.lessonRepository.getLessonsForWeek(startDate, endDate);

      // Get all enabled rooms
      let rooms = await this.roomRepository.getRooms({
        filter: {
          isEnabled: true,
        },
      });

      // Apply building/floor filters if provided
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

      // Return domain objects
      return {
        lessons,
        rooms,
        weekNumber: filters.weekNumber,
        year: filters.year,
      };
    } catch (error) {
      throw PlanningError.notFound(error as Error);
    }
  }

  async optimizePlanning(weekNumber: number, year: number): Promise<void> {
    try {
      const { startDate, endDate } = this.getWeekDateRange(weekNumber, year);

      const [lessons, roomsResult, classes] = await Promise.all([
        this.lessonRepository.getLessonsForWeek(startDate, endDate),
        this.roomRepository.getRooms({
          filter: {
            isEnabled: true,
          },
        }),
        this.classRepository.getClassesWithStudentCount(),
      ]);

      const rooms = roomsResult;

      if (lessons.length === 0) {
        throw PlanningError.notFound();
      }

      const roomIds = rooms.map(r => r.id);
      let environmentalDataMap = new Map();

      try {
        const environmentalData = await this.environmentalDataService.getRoomEnvironmentalData(roomIds);
        environmentalDataMap = new Map(
          environmentalData.map(data => [data.roomId, data]),
        );
      } catch (error) {
        console.warn("Environmental data unavailable, optimizing without it", error);
      }

      const optimizedAssignments = this.planningOptimizer.optimizeLessonRoomAssignments(
        lessons,
        rooms,
        classes,
        environmentalDataMap,
      );

      const updates: Array<{ lessonId: string; roomId: string }> = [];

      // Collect room assignments that have changed
      lessons.forEach(lesson => {
        const optimizedRoomId = optimizedAssignments.get(lesson.id);
        if (optimizedRoomId && optimizedRoomId !== lesson.room_id) {
          updates.push({ lessonId: lesson.id, roomId: optimizedRoomId });
        }
      });

      // Save the optimized room assignments to database
      if (updates.length > 0) {
        await this.lessonRepository.updateMultipleLessonRooms(updates);
      }
    } catch (error) {
      if (error instanceof PlanningError) {
        throw error;
      }
      throw PlanningError.optimizationFailed(error as Error);
    }
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

}