import { and, eq, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { classTable } from "../../../database/schema";
import { ClassError } from "../../middleware/error/classError";
import { IClassRepository } from "./interface/IRepository";
import { Class, ClassFilter, CreateClassParams, dbClass, GetClassesQueryParams, PatchClassParams, PutClassParams } from "./validate";

@Service()
export class ClassRepository implements IClassRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
  }

  private transformClass(cls: dbClass): Class {
    return {
      id: cls.id,
      name: cls.name,
      studentCount: cls.student_count,
    };
  }

  private applyFilter(filter: ClassFilter, query: any) {
    if (!filter) { return; }

    const conditions = [];

    if (filter.search) {
      conditions.push(ilike(classTable.name, `%${filter.search}%`));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
  }

  async create(ClassCreateParams: CreateClassParams): Promise<Class> {
    try {
      const result = await this._db
        .insert(classTable)
        .values({
          name: ClassCreateParams.name,
          student_count: ClassCreateParams.studentCount,
        })
        .returning();
      return this.transformClass(result[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw ClassError.alreadyExists(
          `Class name "${ClassCreateParams.name}" already exists.`,
        );
      }
      throw ClassError.creationFailed(
        "Unexpected error during class creation",
        error,
      );
    }
  }

  async getClasses(params: GetClassesQueryParams): Promise<Class[]> {
    const query = this._db.select().from(classTable);

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
    return result.map(c => this.transformClass(c));
  }

  async getClass(id: string): Promise<Class | null> {
    const result = await this._db
      .select()
      .from(classTable)
      .where(eq(classTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.transformClass(result[0]);
  }

  async getClassesCount(filter: ClassFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(classTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async putClass(id: string, classUpdateParams: PutClassParams): Promise<Class> {
    try {
      const updatedClass = await this._db
        .update(classTable)
        .set({
          name: classUpdateParams.name,
          student_count: classUpdateParams.studentCount,
        })
        .where(eq(classTable.id, id))
        .returning();

      if (updatedClass.length === 0) {
        throw ClassError.updateFailed(`Failed to update class with ID "${id}".`);
      }
      return this.transformClass(updatedClass[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw ClassError.alreadyExists(
          `Class name "${classUpdateParams.name}" already exists.`,
        );
      }
      throw ClassError.updateFailed(
        "Unexpected error during class update",
        error,
      );
    }
  }

  async patchClass(id: string, classUpdateParams: PatchClassParams): Promise<Class> {
    try {
      const updateData: Partial<typeof classTable.$inferInsert> = {};

      if (classUpdateParams.name !== undefined) {
        updateData.name = classUpdateParams.name;
      }
      if (classUpdateParams.studentCount !== undefined) {
        updateData.student_count = classUpdateParams.studentCount;
      }

      const result = await this._db
        .update(classTable)
        .set(updateData)
        .where(eq(classTable.id, id))
        .returning();

      if (result.length === 0) {
        throw ClassError.updateFailed(`Failed to update class with ID "${id}".`);
      }
      return this.transformClass(result[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw ClassError.alreadyExists(
          `Class name "${classUpdateParams.name}" already exists.`,
        );
      }
      throw ClassError.updateFailed(
        "Unexpected error during class update",
        error,
      );
    }
  }

  async deleteClass(id: string): Promise<void> {
    await this._db.delete(classTable).where(eq(classTable.id, id));
  }

  async getClassByName(name: string): Promise<Class> {
    const result = await this._db
      .select()
      .from(classTable)
      .where(eq(classTable.name, name))
      .limit(1);

    if (result.length === 0) {
      throw ClassError.notFound(`Class with name "${name}" not found.`);
    }

    return this.transformClass(result[0]);

  }
}
