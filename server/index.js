require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const errorHandler = require('./middleware/errorHandler');
const petsRouter   = require('./routes/pets');
const tasksRouter  = require('./routes/tasks');
const visitsRouter = require('./routes/visits');
const seedDatabase = require('./seed');

const app = express();

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/pets',     petsRouter);
app.use('/api/tasks',    tasksRouter);
app.use('/api/timeline', tasksRouter);   // timeline GET lives in tasks router
app.use('/api/visits',   visitsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Centralised error handler ───────────────────────────────────────────────
app.use(errorHandler);

// ── DB Connection with in-memory fallback ──────────────────────────────────
const PORT        = process.env.PORT        || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petcare_planner';

async function connectAndStart() {
  // 1. Try local mongod first
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('[DB] Connected to local MongoDB ->', MONGODB_URI);
  } catch (_localErr) {
    // 2. Fall back to mongodb-memory-server
    console.warn('[DB] ⚠️  Local MongoDB unavailable — falling back to mongodb-memory-server …');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      const uri = memServer.getUri();
      await mongoose.connect(uri);
      console.log('[DB] ✅ Connected to in-memory MongoDB →', uri);
    } catch (memErr) {
      console.error('[DB] ❌ Failed to connect to any MongoDB instance:', memErr.message);
      process.exit(1);
    }
  }

  // Seed on first run
  await seedDatabase();

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`[Server] 🚀 PetCare Planner API → http://localhost:${PORT}`);
    });
  }
}

if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  connectAndStart();
}

module.exports = { app, connectAndStart };
