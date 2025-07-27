import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { database } from "../../../database/database";
import { classTable } from "../../../database/schema/class";
import type { Class } from "../../../database/schema/class";
import type { IClassRepository } from "./interface/IRepository";

@Service()
export class ClassRepository implements IClassRepository {
  private db: NodePgDatabase<Record<string, never>>;

  constructor() {
    this.db = database;
  }

  async getClassById(id: string): Promise<Class | null> {
    const result = await this.db
      .select()
      .from(classTable)
      .where(eq(classTable.id, id))
      .limit(1);

    return result[0] || null;
  }

  async getAllClasses(): Promise<Class[]> {
    return this.db
      .select()
      .from(classTable);
  }
}