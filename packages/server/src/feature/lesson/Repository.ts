import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { between, eq } from "drizzle-orm";
import { database } from "../../../database/database";
import { lessonTable } from "../../../database/schema/lesson";
import { roomTable } from "../../../database/schema/room";
import { classTable } from "../../../database/schema/class";
import { type User, userTable } from "../../../database/schema/user";
import { userLessonTable } from "../../../database/schema/userLesson";
import type { LessonWithRelations, ILessonRepository } from "./interface/IRepository";
@Service()
export class LessonRepository implements ILessonRepository {
  private db: NodePgDatabase<Record<string, never>>;

  constructor() {
    this.db = database;
  }

  async getLessonsForWeek(startDate: Date, endDate: Date): Promise<LessonWithRelations[]> {
    const lessonsWithRelations = await this.db
      .select({
        lesson: lessonTable,
        room: roomTable,
        class: classTable,
      })
      .from(lessonTable)
      .leftJoin(roomTable, eq(lessonTable.room_id, roomTable.id))
      .leftJoin(classTable, eq(lessonTable.class_id, classTable.id))
      .where(
        between(lessonTable.start_time, startDate, endDate),
      );

    const lessonsWithTeachers = await Promise.all(
      lessonsWithRelations.map(async (item) => {
        const teachers = await this.db
          .select({
            user: userTable,
          })
          .from(userLessonTable)
          .leftJoin(userTable, eq(userLessonTable.user_id, userTable.id))
          .where(eq(userLessonTable.lesson_id, item.lesson.id));

        return {
          ...item.lesson,
          room: item.room,
          class: item.class,
          users: teachers.map(t => t.user).filter(Boolean) as User[],
        };
      }),
    );

    return lessonsWithTeachers;
  }

  async updateLessonRoom(lessonId: string, roomId: string): Promise<void> {
    await this.db
      .update(lessonTable)
      .set({ room_id: roomId })
      .where(eq(lessonTable.id, lessonId));
  }

  async updateMultipleLessonRooms(updates: Array<{ lessonId: string; roomId: string }>): Promise<void> {
    await this.db.transaction(async (tx) => {
      for (const { lessonId, roomId } of updates) {
        await tx
          .update(lessonTable)
          .set({ room_id: roomId })
          .where(eq(lessonTable.id, lessonId));
      }
    });
  }
}