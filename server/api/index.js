// Vercel Serverless Express API
const express = require('express');
const { randomUUID } = require('crypto');
const vercelApp = express();

vercelApp.use(express.json());
vercelApp.use(express.urlencoded({ extended: false }));

// In-memory storage (simplified from your MemStorage class)
const storage = {
  users: new Map(),
  actions: new Map(),
  nfts: new Map(),
  transactions: new Map(),
  achievements: new Map(),
};

// Seed data (add your seed logic here if needed)
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
    createdAt: new Date(),
  };
  storage.users.set(defaultUser.id, defaultUser);
}

// --- API ROUTES ---
vercelApp.get('/api/user/:id', (req, res) => {
  const user = storage.users.get(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

vercelApp.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const leaderboard = Array.from(storage.users.values())
    .sort((a, b) => (b.btnBalance || 0) - (a.btnBalance || 0))
    .slice(0, limit);
  res.json(leaderboard);
});

// Add more routes as needed (actions, nfts, transactions, achievements, stats)

// Example hello route
vercelApp.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel Express API!' });
});

module.exports = app;// Vercel Serverless Express API
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Example endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel Express API!' });
});

// TODO: Copy your routes from server/routes.ts here

module.exports = vercelApp;
