import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import Container from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

dotenv.config();

const database = drizzle({connection: process.env.DATABASE_URL!, casing: "snake_case"});

Container.set(NodePgDatabase, database);

export { database };

