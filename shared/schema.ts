import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains the same
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Subject categories for articles
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  articleCount: integer("article_count").default(0),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  slug: true,
  icon: true,
  articleCount: true,
});

// Articles schema
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  readTime: integer("read_time").notNull(), // in minutes
  subjectId: integer("subject_id").notNull(),
  author: text("author").notNull(),
  authorImage: text("author_image"),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  translations: json("translations").notNull(), // Contains translated content for different languages
  availableLanguages: text("available_languages").array().notNull(), // List of language codes 
  featured: boolean("featured").default(false),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  imageUrl: true,
  readTime: true,
  subjectId: true, 
  author: true,
  authorImage: true,
  publishDate: true,
  translations: true,
  availableLanguages: true,
  featured: true,
});

// Schema for translations content
export const translationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type Translation = z.infer<typeof translationSchema>;
