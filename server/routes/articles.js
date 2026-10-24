import express from 'express';
import { FAQ } from '../models/Article.js';
import { Company } from '../models/Company.js';
import { authenticate, authorize, authorizeCompany } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// ─── Helper: Get company from slug ───
const getCompany = async (req, res) => {
  if (req.company) return req.company;
  const company = await Company.findOne({ slug: req.params.slug });
  if (!company) {
    res.status(404).json({ error: 'Company not found' });
    return null;
  }
  req.company = company;
  return company;
};

// ─── GET /api/companies/:slug/faqs ─── Public: list FAQs
router.get('/', async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const filter = { company: company._id };

    // Public requests only see visible FAQs; developers see all
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      filter.isVisible = true;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1 });
    res.json(faqs);
  } catch (err) {
    console.error('List FAQs error:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// ─── POST /api/companies/:slug/faqs ─── Developer: add FAQ
router.post('/', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    // Auto-set order to end of list
    const count = await FAQ.countDocuments({ company: company._id });

    const faq = await FAQ.create({
      company: company._id,
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'General',
      order: count,
    });

    res.status(201).json(faq);
  } catch (err) {
    console.error('Create FAQ error:', err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

// ─── PUT /api/companies/:slug/faqs/:id ─── Developer: edit FAQ
router.put('/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { question, answer, category, isVisible } = req.body;
    const updates = {};
    if (question) updates.question = question.trim();
    if (answer) updates.answer = answer.trim();
    if (category !== undefined) updates.category = category;
    if (isVisible !== undefined) updates.isVisible = isVisible;

    const faq = await FAQ.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      updates,
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json(faq);
  } catch (err) {
    console.error('Update FAQ error:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// ─── DELETE /api/companies/:slug/faqs/:id ─── Developer: delete FAQ
router.delete('/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const faq = await FAQ.findOneAndDelete({ _id: req.params.id, company: company._id });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    console.error('Delete FAQ error:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ─── PUT /api/companies/:slug/faqs/reorder ─── Developer: reorder FAQs
router.put('/reorder', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array is required' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        FAQ.findOneAndUpdate({ _id: id, company: company._id }, { order: index })
      )
    );

    const faqs = await FAQ.find({ company: company._id }).sort({ order: 1 });
    res.json(faqs);
  } catch (err) {
    console.error('Reorder FAQs error:', err);
    res.status(500).json({ error: 'Failed to reorder FAQs' });
  }
});

export default router;
