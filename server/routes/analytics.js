import express from 'express';
import { Category } from '../models/Category.js';
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

// ─── GET /api/companies/:slug/categories ─── Public: list active categories
router.get('/', async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const filter = { company: company._id };

    // Public requests only see active categories
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('List categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ─── POST /api/companies/:slug/categories ─── Developer: add category
router.post('/', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check for duplicate
    const existing = await Category.findOne({
      company: company._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      return res.status(409).json({ error: 'A category with this name already exists' });
    }

    const category = await Category.create({
      company: company._id,
      name: name.trim(),
      description: description || '',
      icon: icon || 'HelpCircle',
    });

    res.status(201).json(category);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// ─── PUT /api/companies/:slug/categories/:id ─── Developer: edit category
router.put('/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { name, description, icon, isActive } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (icon) updates.icon = icon;
    if (isActive !== undefined) updates.isActive = isActive;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      updates,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// ─── DELETE /api/companies/:slug/categories/:id ─── Developer: delete category
router.delete('/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      company: company._id,
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
