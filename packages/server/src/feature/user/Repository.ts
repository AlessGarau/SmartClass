import { Service } from "typedi";
import { User, userTable } from "../../../database/schema/user";
import { eq, and, or, like } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IRepository } from "./interface/IRepository";
import { UserDatabaseMapper } from "./Mapper";
import { UserRegisterParams, GetUsersQuery } from "./validate";

@Service()
export class UserRepository implements IRepository {
  constructor(private db: NodePgDatabase<Record<string, never>>, private userDatabaseMapper: UserDatabaseMapper) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const userDb = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return userDb[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.db.select().from(userTable).where(eq(userTable.id, id));
    return user[0];
  }

  async createUser(user: UserRegisterParams, hashedPassword: string): Promise<User> {
    const newUser = await this.db.insert(userTable).values(
      this.userDatabaseMapper.toUser({ ...user, password: hashedPassword }),
    ).returning();
    return newUser[0];
  }

  async findTeacherByName(firstName: string, lastName: string): Promise<User | null> {
    const teachers = await this.db
      .select()
      .from(userTable)
      .where(
        and(
          eq(userTable.first_name, firstName),
          eq(userTable.last_name, lastName),
          eq(userTable.role, "teacher"),
        ),
      );
    return teachers[0] || null;
  }

  async getTeachers(): Promise<User[]> {
    const teachers = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.role, "teacher"))
      .orderBy(userTable.last_name, userTable.first_name);
    return teachers;
  }

  async getUsers(filters: GetUsersQuery): Promise<User[]> {
    const conditions = [];
    
    if (filters.role) {
      conditions.push(eq(userTable.role, filters.role as "admin" | "teacher"));
    }
    
    if (filters.search) {
      conditions.push(
        or(
          like(userTable.first_name, `%${filters.search}%`),
          like(userTable.last_name, `%${filters.search}%`),
          like(userTable.email, `%${filters.search}%`),
        ),
      );
    }
    
    const query = this.db
      .select()
      .from(userTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(userTable.last_name, userTable.first_name);
    
    return await query;
  }
}