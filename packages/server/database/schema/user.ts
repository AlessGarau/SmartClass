import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 10, enum: ["admin", "teacher"] }).notNull(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export type User = typeof userTable.$inferSelect;

export type UserRegister = Omit<User, "id" | "created_at" | "updated_at">;

export type UserAuth = Omit<User, "password" | "created_at" | "updated_at" | "first_name" | "last_name">;