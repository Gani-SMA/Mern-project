import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/icl_db';

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (mongoose.connection.readyState === 1) return mongoose.connection;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    cachedDb = db;
    console.log('Connected to MongoDB Atlas successfully!');
    return db;
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
}
