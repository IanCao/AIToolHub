import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Get all tools
  app.get("/api/tools", async (_req, res) => {
    const tools = await storage.getAllTools();
    res.json(tools);
  });

  // Get tools by category
  app.get("/api/tools/category/:category", async (req, res) => {
    const tools = await storage.getToolsByCategory(req.params.category);
    res.json(tools);
  });

  // Search tools
  app.get("/api/tools/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    const tools = await storage.searchTools(query);
    res.json(tools);
  });

  // Get featured tools
  app.get("/api/tools/featured", async (_req, res) => {
    const tools = await storage.getFeaturedTools();
    res.json(tools);
  });

  // Get tools by language
  app.get("/api/tools/language/:language", async (req, res) => {
    const tools = await storage.getToolsByLanguage(req.params.language);
    res.json(tools);
  });

  // Get tools by category and language
  app.get("/api/tools/category/:category/language/:language", async (req, res) => {
    const tools = await storage.getToolsByCategoryAndLanguage(
      req.params.category,
      req.params.language
    );
    res.json(tools);
  });

  // New review routes
  app.get("/api/tools/:toolId/reviews", async (req, res) => {
    const toolId = parseInt(req.params.toolId);
    const reviews = await storage.getReviewsByToolId(toolId);
    res.json(reviews);
  });

  app.get("/api/tools/:toolId/rating", async (req, res) => {
    const toolId = parseInt(req.params.toolId);
    const rating = await storage.getAverageRating(toolId);
    res.json({ rating });
  });

  app.post("/api/tools/:toolId/reviews", async (req, res) => {
    const toolId = parseInt(req.params.toolId);
    const reviewData = insertReviewSchema.parse({ ...req.body, toolId });
    const review = await storage.createReview(reviewData);
    res.json(review);
  });

  const httpServer = createServer(app);
  return httpServer;
}