// Vercel Serverless Express API
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage (simplified for Vercel serverless)
const storage = {
  users: new Map(),
  actions: new Map(),
  nfts: new Map(),
  transactions: new Map(),
  achievements: new Map(),
};

// Seed data initialization
function initializeStorage() {
  if (storage.users.size === 0) {
    const defaultUser = {
      id: 'default-user',
      username: 'EcoMiner',
      password: 'password',
      btnBalance: 2847,
      level: 8,
      experience: 2847,
      totalActions: 1247,
      carbonSaved: 23700,
      rank: 47,
      title: 'Rising Miner',
      createdAt: new Date().toISOString(),
    };
    storage.users.set(defaultUser.id, defaultUser);
  }
}

// Initialize storage on module load
initializeStorage();

// Utility functions
function generateId() {
  return randomUUID();
}

// --- USER ROUTES ---
app.get('/api/user/:id', (req, res) => {
  try {
    initializeStorage();
    const user = storage.users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/user/:id/stats', (req, res) => {
  try {
    initializeStorage();
    const user = storage.users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recentActions = Array.from(storage.actions.values())
      .filter(action => action.userId === req.params.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
    
    const achievements = Array.from(storage.achievements.values())
      .filter(achievement => achievement.userId === req.params.id);
    
    const transactions = Array.from(storage.transactions.values())
      .filter(transaction => transaction.userId === req.params.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({
      user,
      recentActions,
      achievements,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  try {
    initializeStorage();
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = Array.from(storage.users.values())
      .sort((a, b) => (b.btnBalance || 0) - (a.btnBalance || 0))
      .slice(0, limit);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- ACTION ROUTES ---
app.post('/api/actions', (req, res) => {
  try {
    initializeStorage();
    const { userId, type, reward } = req.body;
    
    if (!userId || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const action = {
      id: generateId(),
      userId,
      type,
      reward: reward || 0,
      timestamp: new Date().toISOString(),
    };
    
    storage.actions.set(action.id, action);

    // Update user stats
    const user = storage.users.get(userId);
    if (user) {
      user.btnBalance = (user.btnBalance || 0) + (reward || 0);
      user.totalActions = (user.totalActions || 0) + 1;
      user.experience = (user.experience || 0) + (reward || 0);
      user.carbonSaved = (user.carbonSaved || 0) + 10; // 10g CO2 saved per action
      storage.users.set(userId, user);
    }

    res.json(action);
  } catch (error) {
    res.status(400).json({ message: 'Invalid action data' });
  }
});

app.get('/api/actions/total', (req, res) => {
  try {
    initializeStorage();
    const total = storage.actions.size;
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- NFT ROUTES ---
app.get('/api/nfts', (req, res) => {
  try {
    initializeStorage();
    const limit = parseInt(req.query.limit) || 50;
    const nfts = Array.from(storage.nfts.values()).slice(0, limit);
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/nfts/:id', (req, res) => {
  try {
    initializeStorage();
    const nft = storage.nfts.get(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/nfts', (req, res) => {
  try {
    initializeStorage();
    const { name, description, imageUrl, price, creatorId, category } = req.body;
    
    if (!name || !price || !creatorId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const nft = {
      id: generateId(),
      name,
      description,
      imageUrl,
      price,
      creatorId,
      ownerId: creatorId,
      category: category || 'art',
      isListed: true,
      createdAt: new Date().toISOString(),
    };
    
    storage.nfts.set(nft.id, nft);
    res.json(nft);
  } catch (error) {
    res.status(400).json({ message: 'Invalid NFT data' });
  }
});

app.get('/api/user/:id/nfts', (req, res) => {
  try {
    initializeStorage();
    const nfts = Array.from(storage.nfts.values())
      .filter(nft => nft.ownerId === req.params.id);
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- TRANSACTION ROUTES ---
app.get('/api/user/:id/transactions', (req, res) => {
  try {
    initializeStorage();
    const limit = parseInt(req.query.limit) || 50;
    const transactions = Array.from(storage.transactions.values())
      .filter(transaction => transaction.userId === req.params.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    initializeStorage();
    const { userId, type, amount, description } = req.body;
    
    if (!userId || !type || amount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = {
      id: generateId(),
      userId,
      type,
      amount,
      description,
      timestamp: new Date().toISOString(),
    };
    
    storage.transactions.set(transaction.id, transaction);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Invalid transaction data' });
  }
});

// --- ACHIEVEMENT ROUTES ---
app.get('/api/user/:id/achievements', (req, res) => {
  try {
    initializeStorage();
    const achievements = Array.from(storage.achievements.values())
      .filter(achievement => achievement.userId === req.params.id);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/achievements', (req, res) => {
  try {
    initializeStorage();
    const { userId, name, description, icon } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const achievement = {
      id: generateId(),
      userId,
      name,
      description,
      icon: icon || 'star',
      unlockedAt: new Date().toISOString(),
    };
    
    storage.achievements.set(achievement.id, achievement);
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Invalid achievement data' });
  }
});

// --- STATS ROUTE ---
app.get('/api/stats', (req, res) => {
  try {
    initializeStorage();
    const totalActions = storage.actions.size;
    const leaderboard = Array.from(storage.users.values())
      .sort((a, b) => (b.btnBalance || 0) - (a.btnBalance || 0))
      .slice(0, 3);
    
    res.json({
      activeMiners: "2.4M+",
      carbonSaved: "150K",
      transactionsToday: "45.2K",
      totalActions,
      topMiners: leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel Express API!' });
});

module.exports = app;
