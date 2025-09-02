import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActionSchema, insertNFTSchema, insertTransactionSchema, insertAchievementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/:id/stats", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const recentActions = await storage.getUserActions(req.params.id, 10);
      const achievements = await storage.getUserAchievements(req.params.id);
      const transactions = await storage.getUserTransactions(req.params.id, 10);

      res.json({
        user,
        recentActions,
        achievements,
        transactions,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Action mining routes
  app.post("/api/actions", async (req, res) => {
    try {
      const validatedData = insertActionSchema.parse(req.body);
      const action = await storage.createAction(validatedData);
      
      // Update user stats
      const user = await storage.getUser(validatedData.userId || "");
      if (user) {
        await storage.updateUser(user.id, {
          btnBalance: (user.btnBalance || 0) + (validatedData.reward || 0),
          totalActions: (user.totalActions || 0) + 1,
          experience: (user.experience || 0) + (validatedData.reward || 0),
          carbonSaved: (user.carbonSaved || 0) + 10, // 10g CO2 saved per action
        });
      }

      res.json(action);
    } catch (error) {
      res.status(400).json({ message: "Invalid action data" });
    }
  });

  app.get("/api/actions/total", async (req, res) => {
    try {
      const total = await storage.getTotalActions();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // NFT routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const nfts = await storage.getNFTs(limit);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const nft = await storage.getNFT(req.params.id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const validatedData = insertNFTSchema.parse(req.body);
      const nft = await storage.createNFT(validatedData);
      res.json(nft);
    } catch (error) {
      res.status(400).json({ message: "Invalid NFT data" });
    }
  });

  app.get("/api/user/:id/nfts", async (req, res) => {
    try {
      const nfts = await storage.getUserNFTs(req.params.id);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transaction routes
  app.get("/api/user/:id/transactions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getUserTransactions(req.params.id, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Achievement routes
  app.get("/api/user/:id/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ message: "Invalid achievement data" });
    }
  });

  // Global stats
  app.get("/api/stats", async (req, res) => {
    try {
      const totalActions = await storage.getTotalActions();
      const leaderboard = await storage.getLeaderboard(3);
      
      res.json({
        activeMiners: "2.4M+",
        carbonSaved: "150K",
        transactionsToday: "45.2K",
        totalActions,
        topMiners: leaderboard,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
