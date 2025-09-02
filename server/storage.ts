import { type User, type InsertUser, type Action, type InsertAction, type NFT, type InsertNFT, type Transaction, type InsertTransaction, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getLeaderboard(limit?: number): Promise<User[]>;

  // Action methods
  createAction(action: InsertAction): Promise<Action>;
  getUserActions(userId: string, limit?: number): Promise<Action[]>;
  getTotalActions(): Promise<number>;

  // NFT methods
  createNFT(nft: InsertNFT): Promise<NFT>;
  getNFTs(limit?: number): Promise<NFT[]>;
  getNFT(id: string): Promise<NFT | undefined>;
  getUserNFTs(userId: string): Promise<NFT[]>;

  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;

  // Achievement methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private actions: Map<string, Action> = new Map();
  private nfts: Map<string, NFT> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private achievements: Map<string, Achievement> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: "default-user",
      username: "EcoMiner",
      password: "password",
      btnBalance: 2847,
      level: 8,
      experience: 2847,
      totalActions: 1247,
      carbonSaved: 23700, // 23.7 kg in grams
      rank: 47,
      title: "Rising Miner",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Seed some NFTs
    const nftData = [
      {
        name: "Green Future #001",
        description: "Sustainable energy visualization",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        price: 2550, // 25.5 BTN in cents
        category: "art",
      },
      {
        name: "Wind Symphony #007", 
        description: "Wind energy abstract composition",
        imageUrl: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        price: 4500,
        category: "art",
      },
      {
        name: "Forest Guardian #024",
        description: "Nature preservation art",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        price: 1280,
        category: "collectibles",
      },
      {
        name: "Solar Dreams #055",
        description: "Solar power artistic vision", 
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        price: 3320,
        category: "art",
      },
    ];

    nftData.forEach((nft, index) => {
      const id = randomUUID();
      this.nfts.set(id, {
        id,
        ...nft,
        creatorId: defaultUser.id,
        ownerId: defaultUser.id,
        isListed: true,
        createdAt: new Date(),
      });
    });

    // Seed some transactions
    const transactionData = [
      { type: "mining", amount: 1525, description: "Action Mining Reward" },
      { type: "purchase", amount: -4500, description: "NFT Purchase" },
      { type: "bonus", amount: 1000, description: "Daily Bonus" },
    ];

    transactionData.forEach(tx => {
      const id = randomUUID();
      this.transactions.set(id, {
        id,
        userId: defaultUser.id,
        ...tx,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Random time in last week
      });
    });

    // Seed some achievements
    const achievementData = [
      { name: "First Thousand", description: "1,000 actions mined", icon: "star" },
      { name: "Social Butterfly", description: "50 social shares", icon: "globe" },
      { name: "Consistency Master", description: "7 days streak", icon: "star" },
      { name: "Community Builder", description: "5 referrals", icon: "users" },
    ];

    achievementData.forEach(achievement => {
      const id = randomUUID();
      this.achievements.set(id, {
        id,
        userId: defaultUser.id,
        ...achievement,
        unlockedAt: new Date(Date.now() - Math.random() * 86400000 * 30), // Random time in last month
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      btnBalance: 0,
      level: 1,
      experience: 0,
      totalActions: 0,
      carbonSaved: 0,
      rank: 0,
      title: "New Miner",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(limit = 50): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.btnBalance || 0) - (a.btnBalance || 0))
      .slice(0, limit);
  }

  async createAction(insertAction: InsertAction): Promise<Action> {
    const id = randomUUID();
    const action: Action = {
      id,
      userId: insertAction.userId || null,
      type: insertAction.type,
      reward: insertAction.reward || null,
      timestamp: new Date(),
    };
    this.actions.set(id, action);
    return action;
  }

  async getUserActions(userId: string, limit = 50): Promise<Action[]> {
    return Array.from(this.actions.values())
      .filter(action => action.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async getTotalActions(): Promise<number> {
    return this.actions.size;
  }

  async createNFT(insertNFT: InsertNFT): Promise<NFT> {
    const id = randomUUID();
    const nft: NFT = {
      id,
      name: insertNFT.name,
      description: insertNFT.description || null,
      imageUrl: insertNFT.imageUrl || null,
      price: insertNFT.price,
      creatorId: insertNFT.creatorId || null,
      ownerId: insertNFT.creatorId || null,
      category: insertNFT.category || null,
      isListed: true,
      createdAt: new Date(),
    };
    this.nfts.set(id, nft);
    return nft;
  }

  async getNFTs(limit = 50): Promise<NFT[]> {
    return Array.from(this.nfts.values())
      .filter(nft => nft.isListed)
      .slice(0, limit);
  }

  async getNFT(id: string): Promise<NFT | undefined> {
    return this.nfts.get(id);
  }

  async getUserNFTs(userId: string): Promise<NFT[]> {
    return Array.from(this.nfts.values())
      .filter(nft => nft.ownerId === userId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      id,
      userId: insertTransaction.userId || null,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      description: insertTransaction.description || null,
      timestamp: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      id,
      userId: insertAchievement.userId || null,
      name: insertAchievement.name,
      description: insertAchievement.description || null,
      icon: insertAchievement.icon || null,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
