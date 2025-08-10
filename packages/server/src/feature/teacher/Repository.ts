import { and, eq, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { userTable } from "../../../database/schema";
import { TeacherError } from "../../middleware/error/teacherError";
import { ITeacherRepository } from "./interface/IRepository";
import { CreateTeacherParams, dbTeacher, GetTeachersQueryParams, PatchTeacherParams, PutTeacherParams, Teacher, TeacherFilter } from "./validate";

@Service()
export class TeacherRepository implements ITeacherRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
  }

  private transformTeacher(teacher: dbTeacher): Teacher {
    return {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
      firstName: teacher.first_name,
      lastName: teacher.last_name,
      createdAt: teacher.created_at,
      updatedAt: teacher.updated_at,
    };
  }

  private applyFilter(filter: TeacherFilter, query: any) {
    const conditions = [eq(userTable.role, "teacher")];

    if (filter && filter.search) {
      conditions.push(ilike(userTable.last_name, `%${filter.search}%`));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
  }

  async create(TeacherCreateParams: CreateTeacherParams, hashedPassword: string): Promise<Teacher> {
    try {
      const result = await this._db
        .insert(userTable)
        .values({
          email: TeacherCreateParams.email,
          password: hashedPassword,
          role: "teacher",
          first_name: TeacherCreateParams.firstName,
          last_name: TeacherCreateParams.lastName,
        })
        .returning();
      return this.transformTeacher(result[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw TeacherError.alreadyExists(
          `Teacher with email "${TeacherCreateParams.email}" already exists.`,
        );
      }
      throw TeacherError.creationFailed(
        "Unexpected error during teacher creation",
        error,
      );
    }
  }

  async getTeachers(params: GetTeachersQueryParams): Promise<Teacher[]> {
    const query = this._db.select().from(userTable);

    this.applyFilter({
      search: params.search,
    }, query);

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const result = await query;
    return result.map(teacher => this.transformTeacher(teacher));
  }

  async getTeachersCount(filter: TeacherFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(userTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async getTeacher(id: string): Promise<Teacher | null> {
    const result = await this._db
      .select()
      .from(userTable)
      .where(and(eq(userTable.id, id), eq(userTable.role, "teacher")))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.transformTeacher(result[0]);
  }

  async putTeacher(id: string, teacherUpdateParams: PutTeacherParams, hashedPassword: string): Promise<Teacher> {
    try {
      const dateNow = new Date();

      const updatedTeacher = await this._db
        .update(userTable)
        .set({
          email: teacherUpdateParams.email,
          password: hashedPassword,
          first_name: teacherUpdateParams.firstName,
          last_name: teacherUpdateParams.lastName,
          created_at: dateNow,
          updated_at: dateNow,
        })
        .where(and(eq(userTable.id, id), eq(userTable.role, "teacher")))
        .returning();

      if (updatedTeacher.length === 0) {
        throw TeacherError.updateFailed(`Failed to update teacher with ID "${id}".`);
      }
      return this.transformTeacher(updatedTeacher[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw TeacherError.alreadyExists(
          `Teacher with email "${teacherUpdateParams.email}" already exists.`,
        );
      }
      throw TeacherError.updateFailed(
        "Unexpected error during teacher update",
        error,
      );
    }
  }

  async patchTeacher(id: string, teacherUpdateParams: PatchTeacherParams): Promise<Teacher> {
    try {
      const updateData: Partial<typeof userTable.$inferInsert> = {};

      if (teacherUpdateParams.email !== undefined) {
        updateData.email = teacherUpdateParams.email;
      }
      if (teacherUpdateParams.password !== undefined) {
        updateData.password = teacherUpdateParams.password;
      }
      if (teacherUpdateParams.firstName !== undefined) {
        updateData.first_name = teacherUpdateParams.firstName;
      }
      if (teacherUpdateParams.lastName !== undefined) {
        updateData.last_name = teacherUpdateParams.lastName;
      }

      updateData.updated_at = new Date();

      const result = await this._db
        .update(userTable)
        .set(updateData)
        .where(and(eq(userTable.id, id), eq(userTable.role, "teacher")))
        .returning();

      if (result.length === 0) {
        throw TeacherError.updateFailed(`Failed to update teacher with ID "${id}".`);
      }
      return this.transformTeacher(result[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw TeacherError.alreadyExists(
          `Teacher with email "${teacherUpdateParams.email}" already exists.`,
        );
      }
      throw TeacherError.updateFailed(
        "Unexpected error during teacher update",
        error,
      );
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    await this._db.delete(userTable).where(and(eq(userTable.id, id), eq(userTable.role, "teacher")));
  }
}
