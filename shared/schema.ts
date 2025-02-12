import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = [
  "Text",
  "Image",
  "Code",
  "Audio",
  "Video",
  "Business",
  "Productivity",
  "Other",
] as const;

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: integer("featured").default(0),
});

export const insertToolSchema = createInsertSchema(tools).omit({ id: true });

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;
export type Category = typeof categories[number];
