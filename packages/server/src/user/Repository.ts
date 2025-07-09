import { Service } from "typedi";
import { User, userTable } from "../../database/schema/user";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IRepository } from "./interface/IRepository";
import { UserDatabaseMapper } from "./Mapper";

@Service()
export class UserRepository implements IRepository {
  constructor(private db: NodePgDatabase<Record<string, never>>, private userDatabaseMapper: UserDatabaseMapper) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return user[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.db.select().from(userTable).where(eq(userTable.id, id));
    return user[0];
  }

  async createUser(email: string, password: string, firstName: string, lastName: string, role: "teacher" | "admin"): Promise<User> {
    const user = await this.db.insert(userTable).values(
      this.userDatabaseMapper.toUser({ email, password, firstName, lastName, role }),
    ).returning();
    return user[0];
  }
}