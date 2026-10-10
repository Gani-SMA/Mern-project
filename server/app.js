import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ticketsRoutes from './routes/tickets.js';
import articlesRoutes from './routes/articles.js';
import analyticsRoutes from './routes/analytics.js';
import { seedDatabaseIfEmpty } from './seedData.js';

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/icl_db';

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mongoose Connection Cache for Serverless (Vercel) & Local
let cachedDb = null;
let isSeeded = false;

export async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (mongoose.connection.readyState === 2) {
    // connecting... wait
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (mongoose.connection.readyState === 1) return mongoose.connection;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    cachedDb = db;

    if (!isSeeded) {
      await seedDatabaseIfEmpty();
      isSeeded = true;
    }

    return db;
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
}

// Auto-connect middleware for all /api requests
app.use('/api', async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    // If db fails, continue so health check or error handling can respond
    next();
  }
});

// Health Check / Connection Status
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: readyState === 1 ? 'ok' : 'degraded',
    database: {
      status: states[readyState] || 'unknown',
      connected: readyState === 1,
      name: mongoose.connection.name || 'icl_db',
      host: mongoose.connection.host || 'MongoDB Atlas',
    },
    serverTime: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
