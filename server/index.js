import app, { connectToDatabase } from './app.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log('Connecting to MongoDB Atlas Cluster...');
    await connectToDatabase();
    console.log('Connected to MongoDB Atlas successfully!');

    app.listen(PORT, () => {
      console.log(`ResolveIT API Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed, starting server in fallback mode:', err.message);
    app.listen(PORT, () => {
      console.log(`ResolveIT API Server running on port ${PORT} (Database offline)`);
    });
  }
}

start();
