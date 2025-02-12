import { tools, type Tool, type InsertTool } from "@shared/schema";

export interface IStorage {
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
}

export class MemStorage implements IStorage {
  private tools: Tool[];

  constructor() {
    // Initialize with some sample data
    this.tools = [
      {
        id: 1,
        name: "ChatGPT",
        description: "Advanced language model for conversation and text generation",
        category: "Text",
        url: "https://chat.openai.com",
        imageUrl: "/ai-chat.svg",
        featured: 1
      },
      {
        id: 2,
        name: "DALL-E",
        description: "AI image generation from natural language descriptions",
        category: "Image",
        url: "https://labs.openai.com",
        imageUrl: "/ai-image.svg",
        featured: 1
      },
      {
        id: 3,
        name: "GitHub Copilot",
        description: "AI pair programmer that helps you write better code",
        category: "Code",
        url: "https://github.com/features/copilot",
        imageUrl: "/ai-code.svg",
        featured: 1
      },
      // Add more sample tools as needed
    ];
  }

  async getAllTools(): Promise<Tool[]> {
    return this.tools;
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return this.tools.filter(tool => tool.category === category);
  }

  async searchTools(query: string): Promise<Tool[]> {
    const lowerQuery = query.toLowerCase();
    return this.tools.filter(
      tool => 
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery)
    );
  }

  async getFeaturedTools(): Promise<Tool[]> {
    return this.tools.filter(tool => tool.featured === 1);
  }
}

export const storage = new MemStorage();
