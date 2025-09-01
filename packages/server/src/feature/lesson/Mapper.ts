import { Service } from "typedi";
import type { LessonWithRelations } from "./interface/IRepository";
import type { PlannedLesson } from "./validate";

@Service()
export class LessonMapper {
  toPlannedClass(lesson: LessonWithRelations): PlannedLesson {
    const teacher = lesson.users?.[0];
    const dayOfWeek = this.getDayOfWeek(lesson.start_time);

    return {
      id: lesson.id,
      title: lesson.title,
      teacher: teacher ? `${teacher.first_name} ${teacher.last_name}` : "TBD",
      startTime: this.formatTime(lesson.start_time),
      endTime: this.formatTime(lesson.end_time),
      room: lesson.room?.name || "",
      dayOfWeek,
      date: this.formatDate(lesson.start_time),
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
    return dayMap[day] || "LUN";
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}