import { pgTable, text, serial, integer, boolean, timestamp, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Auth tables
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    password: text("password"), // Null if using OAuth
    avatar: text("avatar_url"),
    googleId: text("google_id").unique(),
    role: text("role").notNull().default("user"), // user, admin
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
});

// Content tables
export const subjects = pgTable("subjects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull(),
    articleCount: integer("article_count").default(0),
});

export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url").notNull(),
    readTime: integer("read_time").notNull(),
    subjectId: integer("subject_id").notNull(),
    author: text("author").notNull(),
    authorImage: text("author_image"),
    publishDate: timestamp("publish_date").notNull().defaultNow(),
    translations: json("translations").$type<{
        [key: string]: {
            title: string;
            excerpt: string;
            content: string;
            notes?: string[];
            resources?: string[];
        };
    }>().notNull(),
    availableLanguages: text("available_languages").array().notNull(),
    featured: boolean("featured").default(false),
    viewCount: integer("view_count").default(0),
});

// Metrics tables
export const metrics = pgTable("metrics", {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    totalViews: integer("total_views").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    topArticles: json("top_articles").notNull().default([]),
});

// Schemas
export const userSchema = createInsertSchema(users);
export const sessionSchema = createInsertSchema(sessions);
export const subjectSchema = createInsertSchema(subjects);
export const articleSchema = createInsertSchema(articles);
export const metricsSchema = createInsertSchema(metrics);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Metrics = typeof metrics.$inferSelect;