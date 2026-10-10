import express from 'express';
import { Article } from '../models/Article.js';

const router = express.Router();

// GET all KB articles
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'ALL') {
      filter.category = new RegExp(category, 'i');
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { snippet: regex },
        { body: regex },
      ];
    }

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to retrieve articles from database' });
  }
});

// GET article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findOne({ id: req.params.id });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error('Error fetching article by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve article record' });
  }
});

export default router;
