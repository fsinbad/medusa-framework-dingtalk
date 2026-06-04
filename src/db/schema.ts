import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  inventory: integer("inventory").notNull(),
  status: text("status", { enum: ["draft", "published"] }).notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  unionId: text("union_id").notNull().unique(),
  openId: text("open_id").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  mobile: text("mobile"),
  email: text("email"),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});

export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
