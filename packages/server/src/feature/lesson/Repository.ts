import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { between, eq, and, inArray } from "drizzle-orm";
import { database } from "../../../database/database";
import { lessonTable } from "../../../database/schema/lesson";
import { roomTable } from "../../../database/schema/room";
import { classTable } from "../../../database/schema/class";
import { type User, userTable } from "../../../database/schema/user";
import { userLessonTable } from "../../../database/schema/userLesson";
import type { LessonWithRelations, ILessonRepository, CreateLessonData } from "./interface/IRepository";
import type { Lesson } from "../../../database/schema/lesson";
@Service()
export class LessonRepository implements ILessonRepository {
  private db: NodePgDatabase<Record<string, never>>;

  constructor() {
    this.db = database;
  }

  async getLessonsForWeek(startDate: Date, endDate: Date, roomIds?: string[]): Promise<LessonWithRelations[]> {
    const query = this.db
      .select({
        lesson: lessonTable,
        room: roomTable,
        class: classTable,
      })
      .from(lessonTable)
      .leftJoin(roomTable, eq(lessonTable.room_id, roomTable.id))
      .leftJoin(classTable, eq(lessonTable.class_id, classTable.id));

    const conditions = [between(lessonTable.start_time, startDate, endDate)];

    if (roomIds && roomIds.length > 0) {

      const roomFilter = inArray(lessonTable.room_id, roomIds);
      if (roomFilter) {
        conditions.push(roomFilter);
      }
    }

    const lessonsWithRelations = await query.where(and(...conditions));

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

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    const result = await this.db
      .insert(lessonTable)
      .values({
        title: data.title,
        start_time: data.startTime,
        end_time: data.endTime,
        class_id: data.classId,
        room_id: data.roomId,
      })
      .returning();

    return result[0];
  }

  async findLessonByDetails(classId: string, startTime: Date, endTime: Date): Promise<Lesson | null> {
    const result = await this.db
      .select()
      .from(lessonTable)
      .where(
        and(
          eq(lessonTable.class_id, classId),
          eq(lessonTable.start_time, startTime),
          eq(lessonTable.end_time, endTime),
        ),
      )
      .limit(1);

    return result[0] || null;
  }
}