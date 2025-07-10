import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const userMobileDeviceTable = pgTable("user_mobile_device", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().references(() => userTable.id),
  device_token: varchar({ length: 255 }),
  refresh_token: varchar({ length: 255 }),
  last_seen: timestamp("last_seen").notNull().defaultNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type UserMobileDeviceRegister = typeof userMobileDeviceTable.$inferInsert;