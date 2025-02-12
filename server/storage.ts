import { tools, type Tool, type InsertTool } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
  getToolsByLanguage(language: string): Promise<Tool[]>;
  getToolsByCategoryAndLanguage(category: string, language: string): Promise<Tool[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools);
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    // Capitalize first letter to match schema format
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    return await db.select().from(tools).where(eq(tools.category, normalizedCategory));
  }

  async searchTools(query: string): Promise<Tool[]> {
    const lowerQuery = query.toLowerCase();
    const allTools = await this.getAllTools();
    return allTools.filter(
      tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery)
    );
  }

  async getFeaturedTools(): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.featured, 1));
  }

  async getToolsByLanguage(language: string): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.language, language));
  }

  async getToolsByCategoryAndLanguage(category: string, language: string): Promise<Tool[]> {
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    return await db.select()
      .from(tools)
      .where(
        and(
          eq(tools.category, normalizedCategory),
          eq(tools.language, language)
        )
      );
  }
}

export const storage = new DatabaseStorage();