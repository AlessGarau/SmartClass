import { and, ilike } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { classTable } from "../../../database/schema";
import { IClassRepository } from "./interface/IRepository";
import { Class, ClassFilter, GetClassesQueryParams } from "./validate";

@Service()
export class ClassRepository implements IClassRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
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
    return result;
  }
}