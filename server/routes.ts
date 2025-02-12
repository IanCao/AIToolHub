import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);
  return httpServer;
}