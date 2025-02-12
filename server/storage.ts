import { tools, type Tool, type InsertTool } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools);
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.category, category));
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
}

export const storage = new DatabaseStorage();