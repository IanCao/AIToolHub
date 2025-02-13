import { tools, reviews, type Tool, type InsertTool, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
  getToolsByLanguage(language: string): Promise<Tool[]>;
  getToolsByCategoryAndLanguage(category: string, language: string): Promise<Tool[]>;
  // New review methods
  getReviewsByToolId(toolId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getAverageRating(toolId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools);
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
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

  async getReviewsByToolId(toolId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.toolId, toolId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getAverageRating(toolId: number): Promise<number> {
    const toolReviews = await this.getReviewsByToolId(toolId);
    if (toolReviews.length === 0) return 0;
    const sum = toolReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / toolReviews.length;
  }
}

export const storage = new DatabaseStorage();