import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, between, eq, sql } from "drizzle-orm";
import { database } from "../../../database/database";
import { lessonTable } from "../../../database/schema/lesson";
import { roomTable } from "../../../database/schema/room";
import { classTable } from "../../../database/schema/class";
import { userTable } from "../../../database/schema/user";
import { userLessonTable } from "../../../database/schema/userLesson";
import type { LessonWithRelations, ILessonRepository } from "./interface/IRepository";

// Define select types using Drizzle's inference
type UserSelect = typeof userTable.$inferSelect;

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
        and(
          between(lessonTable.start_time, startDate, endDate)
        )
      );

    // Get teachers for each lesson
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
          users: teachers.map(t => t.user).filter(Boolean) as UserSelect[],
        };
      })
    );

    return lessonsWithTeachers;
  }

  async getLessonById(id: string): Promise<LessonWithRelations | null> {
    const result = await this.db
      .select({
        lesson: lessonTable,
        room: roomTable,
        class: classTable,
      })
      .from(lessonTable)
      .leftJoin(roomTable, eq(lessonTable.room_id, roomTable.id))
      .leftJoin(classTable, eq(lessonTable.class_id, classTable.id))
      .where(eq(lessonTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    // Get teachers for the lesson
    const teachers = await this.db
      .select({
        user: userTable,
      })
      .from(userLessonTable)
      .leftJoin(userTable, eq(userLessonTable.user_id, userTable.id))
      .where(eq(userLessonTable.lesson_id, id));

    return {
      ...result[0].lesson,
      room: result[0].room,
      class: result[0].class,
      users: teachers.map(t => t.user).filter(Boolean) as UserSelect[],
    };
  }

  async updateLessonRoom(lessonId: string, roomId: string): Promise<void> {
    await this.db
      .update(lessonTable)
      .set({ room_id: roomId })
      .where(eq(lessonTable.id, lessonId));
  }

  async updateMultipleLessonRooms(updates: Array<{ lessonId: string; roomId: string }>): Promise<void> {
    // Use a transaction to update multiple lessons atomically
    await this.db.transaction(async (tx) => {
      for (const { lessonId, roomId } of updates) {
        await tx
          .update(lessonTable)
          .set({ room_id: roomId })
          .where(eq(lessonTable.id, lessonId));
      }
    });
  }

  async checkRoomAvailability(
    roomId: string,
    startTime: Date,
    endTime: Date,
    excludeLessonId?: string
  ): Promise<boolean> {
    let query = this.db
      .select({ count: sql<number>`count(*)` })
      .from(lessonTable);

    if (excludeLessonId) {
      query = query.where(
        and(
          eq(lessonTable.room_id, roomId),
          sql`${lessonTable.start_time} < ${endTime}`,
          sql`${lessonTable.end_time} > ${startTime}`,
          sql`${lessonTable.id} != ${excludeLessonId}`
        )
      );
    } else {
      query = query.where(
        and(
          eq(lessonTable.room_id, roomId),
          sql`${lessonTable.start_time} < ${endTime}`,
          sql`${lessonTable.end_time} > ${startTime}`
        )
      );
    }

    const result = await query;
    return Number(result[0].count) === 0;
  }

  async checkTeacherAvailability(
    teacherId: string,
    startTime: Date,
    endTime: Date,
    excludeLessonId?: string
  ): Promise<boolean> {
    let query = this.db
      .select({ count: sql<number>`count(*)` })
      .from(userLessonTable)
      .leftJoin(lessonTable, eq(userLessonTable.lesson_id, lessonTable.id));

    if (excludeLessonId) {
      query = query.where(
        and(
          eq(userLessonTable.user_id, teacherId),
          sql`${lessonTable.start_time} < ${endTime}`,
          sql`${lessonTable.end_time} > ${startTime}`,
          sql`${lessonTable.id} != ${excludeLessonId}`
        )
      );
    } else {
      query = query.where(
        and(
          eq(userLessonTable.user_id, teacherId),
          sql`${lessonTable.start_time} < ${endTime}`,
          sql`${lessonTable.end_time} > ${startTime}`
        )
      );
    }

    const result = await query;
    return Number(result[0].count) === 0;
  }
}