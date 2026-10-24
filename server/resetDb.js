import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/icl_db';

async function resetDB() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB. Dropping all collections...');
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    await mongoose.connection.db.dropCollection(col.name);
    console.log(`  Dropped: ${col.name}`);
  }
  
  console.log('All collections dropped. Restart the server to re-seed.');
  await mongoose.disconnect();
  process.exit(0);
}

resetDB().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
