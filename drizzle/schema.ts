import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const inferenceRuns = mysqlTable("inference_runs", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  sector: varchar("sector", { length: 64 }).notNull(),
  input: text("input").notNull(),
  signal: varchar("signal", { length: 255 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }).notNull(),
  reasoning: text("reasoning").notNull(),
  recommendedAction: text("recommendedAction").notNull(),
  reviewStatus: mysqlEnum("reviewStatus", ["auto-approved", "needs-review", "approved", "rejected"]).default("needs-review").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reviewActions = mysqlTable("review_actions", {
  id: int("id").autoincrement().primaryKey(),
  inferenceRunId: int("inferenceRunId").notNull(),
  action: mysqlEnum("action", ["approve", "reject", "annotate"]).notNull(),
  annotation: text("annotation"),
  reviewerName: varchar("reviewerName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InferenceRun = typeof inferenceRuns.$inferSelect;
export type ReviewAction = typeof reviewActions.$inferSelect;
