import { Service } from "typedi";
import type { LessonWithRelations } from "../../lesson/interface/IRepository";
import type { RoomEnvironmentalData } from "../interface/IRepository";
import type { roomTable } from "../../../../database/schema/room";
import type { classTable } from "../../../../database/schema/class";

// Define select types using Drizzle's inference
type RoomSelect = typeof roomTable.$inferSelect;
type ClassSelect = typeof classTable.$inferSelect;

interface OptimizationScore {
  roomId: string;
  lessonId: string;
  score: number;
  factors: {
    capacityScore: number;
    environmentalScore: number;
    proximityScore: number;
  };
}

@Service()
export class PlanningOptimizer {
  /**
   * Optimize room assignments for lessons based on:
   * - Room capacity vs class size
   * - Environmental comfort scores
   * - Minimize student/teacher movement between rooms
   */
  optimizeLessonRoomAssignments(
    lessons: LessonWithRelations[],
    rooms: RoomSelect[],
    classes: ClassSelect[],
    environmentalData: Map<string, RoomEnvironmentalData>,
  ): Map<string, string> {
    const optimizedAssignments = new Map<string, string>();

    const sortedLessons = [...lessons].sort((a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    const roomUsageByClass = new Map<string, string[]>();
    const roomUsageByTeacher = new Map<string, string[]>();

    for (const lesson of sortedLessons) {
      const scores: OptimizationScore[] = [];

      const classInfo = classes.find(c => c.id === lesson.class_id);
      if (!classInfo) {
        continue;
      }

      for (const room of rooms) {
        if (!room.is_enabled) {
          continue;
        }

        const isAvailable = this.checkRoomAvailability(
          room.id,
          lesson.start_time,
          lesson.end_time,
          optimizedAssignments,
          sortedLessons,
        );

        if (!isAvailable) {
          continue;
        }

        const score = this.calculateOptimizationScore(
          lesson,
          room,
          classInfo,
          environmentalData.get(room.id),
          roomUsageByClass.get(lesson.class_id || "") || [],
          roomUsageByTeacher.get(lesson.users?.[0]?.id || "") || [],
        );

        scores.push(score);
      }

      if (scores.length > 0) {
        scores.sort((a, b) => b.score - a.score);
        const bestRoom = scores[0];

        optimizedAssignments.set(lesson.id, bestRoom.roomId);

        if (lesson.class_id) {
          const classRooms = roomUsageByClass.get(lesson.class_id) || [];
          classRooms.push(bestRoom.roomId);
          roomUsageByClass.set(lesson.class_id, classRooms);
        }

        const teacherId = lesson.users?.[0]?.id;
        if (teacherId) {
          const teacherRooms = roomUsageByTeacher.get(teacherId) || [];
          teacherRooms.push(bestRoom.roomId);
          roomUsageByTeacher.set(teacherId, teacherRooms);
        }
      }
    }

    return optimizedAssignments;
  }

  private checkRoomAvailability(
    roomId: string,
    startTime: Date,
    endTime: Date,
    currentAssignments: Map<string, string>,
    allLessons: LessonWithRelations[],
  ): boolean {

    for (const [lessonId, assignedRoomId] of currentAssignments) {
      if (assignedRoomId !== roomId) {
        continue;
      }

      const lesson = allLessons.find(l => l.id === lessonId);
      if (!lesson) {
        continue;
      }

      if (
        new Date(lesson.start_time) < new Date(endTime) &&
        new Date(lesson.end_time) > new Date(startTime)
      ) {
        return false;
      }
    }

    return true;
  }

  private calculateOptimizationScore(
    lesson: LessonWithRelations,
    room: RoomSelect,
    classInfo: ClassSelect,
    environmentalData?: RoomEnvironmentalData,
    previousClassRooms: string[] = [],
    previousTeacherRooms: string[] = [],
  ): OptimizationScore {
    // 1. Capacity score (0-40 points)
    const capacityRatio = classInfo.student_count / room.capacity;
    let capacityScore = 0;

    if (capacityRatio <= 1.0 && capacityRatio >= 0.5) {
      // Ideal: 50-100% capacity usage
      capacityScore = 40;
    } else if (capacityRatio < 0.5) {
      // Room too big
      capacityScore = 40 * (capacityRatio * 2); // Linear decrease
    } else {
      // Room too small (overcrowded)
      capacityScore = 0;
    }

    // 2. Environmental score (0-40 points)
    const environmentalScore = environmentalData
      ? (environmentalData.comfortScore / 100) * 40
      : 20; // Default middle score if no data

    // 3. Proximity score (0-20 points)
    let proximityScore = 20;

    // Reduce score if class/teacher has to change rooms frequently
    const classRoomChanges = previousClassRooms.filter(r => r !== room.id).length;
    const teacherRoomChanges = previousTeacherRooms.filter(r => r !== room.id).length;

    proximityScore -= Math.min(10, classRoomChanges * 2); // -2 points per room change
    proximityScore -= Math.min(10, teacherRoomChanges * 2); // -2 points per room change

    const totalScore = capacityScore + environmentalScore + proximityScore;

    return {
      roomId: room.id,
      lessonId: lesson.id,
      score: totalScore,
      factors: {
        capacityScore,
        environmentalScore,
        proximityScore,
      },
    };
  }
}