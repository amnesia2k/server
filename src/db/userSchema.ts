import { sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "creator", "admin"]);

export const usersTable = pgTable("users", {
  _id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  // token: varchar({ length: 255 }).notNull(),
  bio: varchar({ length: 255 }).default("I'm a new user!"),
  image: varchar({ length: 255 }).default("https://example.com/avatar.jpg"),
  role: userRoleEnum("role").notNull().default("user"),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});
