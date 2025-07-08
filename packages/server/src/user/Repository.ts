import { Service } from "typedi";
import { User, userTable } from "../../database/schema/user";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

@Service()
export class UserRepository {
  constructor(private db: NodePgDatabase<Record<string, never>>) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return user[0];
  }

  async createUser(email: string, password: string, first_name: string, last_name: string, role: "teacher" | "admin"): Promise<User> {
    const user = await this.db.insert(userTable).values({ email, password, first_name, last_name, role}).returning();
    return user[0];
  }
}