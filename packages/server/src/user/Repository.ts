import { Service } from "typedi";
import { User, userTable } from "../../database/schema/user";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IRepository } from "./interface/IRepository";
import { UserDatabaseMapper } from "./Mapper";
import { UserRegisterParams } from "./validate";

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
}
