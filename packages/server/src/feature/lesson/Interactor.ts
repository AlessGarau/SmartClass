import { Service } from "typedi";
import { LessonRepository } from "./Repository";
import { UserRepository } from "../user/Repository";
import { OptimizationService } from "../../services/OptimizationService";
import { startOfDay, min, max, endOfDay } from "date-fns";
import type { ILessonInteractor } from "./interface/IInteractor";
import type { UpdateLessonBody, PlannedLesson } from "./validate";
import { LessonError } from "../../middleware/error/lessonError";
import { LessonMapper } from "./Mapper";
import { UserError } from "../../middleware/error/userError";

@Service()
export class LessonInteractor implements ILessonInteractor {
  constructor(
    private lessonRepository: LessonRepository,
    private userRepository: UserRepository,
    private lessonMapper: LessonMapper,
    private optimizationService: OptimizationService,
  ) { }

  async updateLesson(lessonId: string, lessonData: UpdateLessonBody): Promise<PlannedLesson> {

    const lesson = await this.lessonRepository.getLessonWithRelations(lessonId);
    if (!lesson) {
      throw LessonError.notFound();
    }

    const teacher = await this.userRepository.getUserById(lessonData.teacher);
    if (!teacher) {
      throw UserError.notFound();
    }

    const currentTeacher = lesson.users?.[0];
    if (!currentTeacher || currentTeacher.id !== teacher.id) {
      await this.validateTeacherAvailability(teacher.id, lessonId, lessonData);
    }

    const oldStartTime = `${lesson.start_time.getHours().toString().padStart(2, "0")}:${lesson.start_time.getMinutes().toString().padStart(2, "0")}`;
    const oldEndTime = `${lesson.end_time.getHours().toString().padStart(2, "0")}:${lesson.end_time.getMinutes().toString().padStart(2, "0")}`;
    const oldDate = lesson.start_time.toISOString().split("T")[0];

    const hasTimeOrDateChanged =
      oldStartTime !== lessonData.startTime ||
      oldEndTime !== lessonData.endTime ||
      oldDate !== lessonData.date;

    await this.lessonRepository.updateLesson(lessonId, {
      title: lessonData.title,
      roomId: lesson.room_id!,
      startTime: lessonData.startTime,
      endTime: lessonData.endTime,
      dayOfWeek: lessonData.dayOfWeek,
      date: lessonData.date,
    });

    await this.lessonRepository.updateLessonTeacher(lessonId, teacher.id);

    if (hasTimeOrDateChanged) {
      try {
        const oldLessonDate = lesson.start_time;
        const newLessonDate = new Date(lessonData.date);

        const earliestDate = min([oldLessonDate, newLessonDate]);
        const latestDate = max([oldLessonDate, newLessonDate]);

        const optimizeStart = startOfDay(earliestDate);
        const optimizeEnd = endOfDay(latestDate);

        await this.optimizationService.optimizeDateRange(optimizeStart, optimizeEnd);
      } catch (error) {
        console.error("Failed to optimize planning after lesson update:", error);
        // Continue with the response even if optimization fails
      }
    }

    const lessonWithRelations = await this.lessonRepository.getLessonWithRelations(lessonId);
    if (!lessonWithRelations) {
      throw LessonError.notFound();
    }

    return this.lessonMapper.toPlannedClass(lessonWithRelations);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson) {
      throw LessonError.notFound();
    }

    await this.lessonRepository.deleteLesson(lessonId);
  }

  private async validateTeacherAvailability(
    teacherId: string,
    lessonId: string,
    lessonData: UpdateLessonBody,
  ): Promise<void> {
    const [hours, minutes] = lessonData.startTime.split(":").map(Number);
    const [endHours, endMinutes] = lessonData.endTime.split(":").map(Number);
    const lessonDate = new Date(lessonData.date);

    const newStartTime = new Date(lessonDate);
    newStartTime.setHours(hours, minutes, 0, 0);

    const newEndTime = new Date(lessonDate);
    newEndTime.setHours(endHours, endMinutes, 0, 0);

    const dayLessons = await this.lessonRepository.getLessonsBetween(
      startOfDay(lessonDate),
      endOfDay(lessonDate),
    );

    const hasConflict = dayLessons.some(otherLesson => {
      if (otherLesson.id === lessonId) { return false; }

      const hasTeacher = otherLesson.users?.some(u => u.id === teacherId);
      if (!hasTeacher) { return false; }

      const otherStart = otherLesson.start_time;
      const otherEnd = otherLesson.end_time;

      return (newStartTime < otherEnd && newEndTime > otherStart);
    });

    if (hasConflict) {
      throw LessonError.teacherNotAvailable();
    }
  }
}