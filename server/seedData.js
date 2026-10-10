import { Ticket } from './models/Ticket.js';
import { Article } from './models/Article.js';
import { INITIAL_TICKETS, KB_ARTICLES } from './data/initialData.js';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Tickets if none exist
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log('Seeding initial formal dockets into MongoDB Atlas...');
      await Ticket.insertMany(INITIAL_TICKETS);
      console.log(`Seeded ${INITIAL_TICKETS.length} dispute tickets in MongoDB Atlas.`);
    }

    // 2. Seed Articles if none exist
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      console.log('Seeding statutory knowledge base articles into MongoDB Atlas...');
      await Article.insertMany(KB_ARTICLES);
      console.log(`Seeded ${KB_ARTICLES.length} KB articles in MongoDB Atlas.`);
    }
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
}
