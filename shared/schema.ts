import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  btnBalance: integer("btn_balance").default(0),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  totalActions: integer("total_actions").default(0),
  carbonSaved: integer("carbon_saved").default(0), // in grams
  rank: integer("rank").default(0),
  title: text("title").default("New Miner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const actions = pgTable("actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // click, scroll, share, etc.
  reward: integer("reward").default(0), // BTN tokens earned
  timestamp: timestamp("timestamp").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: integer("price").notNull(), // in BTN tokens
  creatorId: varchar("creator_id").references(() => users.id),
  ownerId: varchar("owner_id").references(() => users.id),
  category: text("category").default("art"),
  isListed: boolean("is_listed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // mining, purchase, sale, staking
  amount: integer("amount").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("star"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertActionSchema = createInsertSchema(actions).pick({
  userId: true,
  type: true,
  reward: true,
});

export const insertNFTSchema = createInsertSchema(nfts).pick({
  name: true,
  description: true,
  imageUrl: true,
  price: true,
  creatorId: true,
  category: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  name: true,
  description: true,
  icon: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAction = z.infer<typeof insertActionSchema>;
export type InsertNFT = z.infer<typeof insertNFTSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type User = typeof users.$inferSelect;
export type Action = typeof actions.$inferSelect;
export type NFT = typeof nfts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
