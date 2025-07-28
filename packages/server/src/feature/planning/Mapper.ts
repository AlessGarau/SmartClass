import { Service } from "typedi";
import type { IPlanningMapper } from "./interface/IMapper";
import type { LessonWithRelations } from "../lesson/interface/IRepository";
import type { Room } from "../room/validate";
import { PlannedClass, RoomWithPlannedClasses, WeeklyPlanningResult } from "./validate";

@Service()
export class PlanningMapper implements IPlanningMapper {
  toWeekPlanningData(
    lessons: LessonWithRelations[],
    rooms: Room[],
    weekNumber: number,
    year: number,
  ): WeeklyPlanningResult {

    const roomLessonsMap = new Map<string, LessonWithRelations[]>();

    lessons.forEach(lesson => {
      if (lesson.room?.id) {
        const roomLessons = roomLessonsMap.get(lesson.room.id) || [];
        roomLessons.push(lesson);
        roomLessonsMap.set(lesson.room.id, roomLessons);
      }
    });

    const classrooms = rooms
      .filter(room => room.is_enabled)
      .map(room => this.toClassroom(room, roomLessonsMap.get(room.id) || []));

    return {
      weekNumber,
      year,
      classrooms,
    };
  }

  toClassroom(room: Room, lessons: LessonWithRelations[]): RoomWithPlannedClasses {
    const plannedClasses: PlannedClass[] = lessons.map(lesson => {
      const teacher = lesson.users?.[0];
      const dayOfWeek = this.getDayOfWeek(lesson.start_time);

      return {
        id: lesson.id,
        subject: lesson.title,
        teacher: teacher ? `${teacher.first_name} ${teacher.last_name}` : "TBD",
        startTime: this.formatTime(lesson.start_time),
        endTime: this.formatTime(lesson.end_time),
        room: room.name,
        dayOfWeek,
      };
    });

    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      plannedClasses,
    };
  }

  private getDayOfWeek(date: Date): "LUN" | "MAR" | "MER" | "JEU" | "VEN" {
    const dayMap: Record<number, "LUN" | "MAR" | "MER" | "JEU" | "VEN"> = {
      1: "LUN",
      2: "MAR",
      3: "MER",
      4: "JEU",
      5: "VEN",
    };

    const day = date.getDay();
    // Sunday (0) and Saturday (6) are not included
    return dayMap[day] || "LUN";
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

}