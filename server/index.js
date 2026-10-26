import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { seedDatabaseIfEmpty } from './seedData.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log('Connecting to MongoDB Atlas Cluster...');
    await connectToDatabase();

    // Seed demo data if database is empty
    await seedDatabaseIfEmpty();

    app.listen(PORT, () => {
      console.log(`ResolveIT API Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Database connection failed, starting server in fallback mode:', err.message);
    app.listen(PORT, () => {
      console.log(`ResolveIT API Server running on port ${PORT} (Database offline)`);
    });
  }
}

start();
