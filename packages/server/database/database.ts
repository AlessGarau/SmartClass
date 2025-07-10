import dotenv from "dotenv";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import Container from "typedi";

dotenv.config();

const database = drizzle({ connection: process.env.DATABASE_URL!, casing: "snake_case" });

Container.set(NodePgDatabase, database);

export { database };

