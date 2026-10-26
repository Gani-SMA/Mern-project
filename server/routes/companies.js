import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Ticket } from '../models/Ticket.js';
import { FAQ } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { authenticate, authorize, authorizeCompany } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true }); // Access :slug from parent

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

// ─── GET /api/companies/:slug/public ─── Public info for service page (no auth)
router.get('/public', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug })
      .select('name slug logo industry branding status');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.status === 'suspended') {
      return res.status(403).json({ error: 'This company service page is currently unavailable' });
    }

    const [faqs, categories] = await Promise.all([
      FAQ.find({ company: company._id, isVisible: true }).sort({ order: 1 }),
      Category.find({ company: company._id, isActive: true }),
    ]);

    res.json({ company, faqs, categories });
  } catch (err) {
    console.error('Public company info error:', err);
    res.status(500).json({ error: 'Failed to load company info' });
  }
});

// ─── GET /api/companies/:slug/dashboard ─── Company analytics (developer + employee)
router.get('/dashboard', authenticate, authorize('developer', 'employee', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const tickets = await Ticket.find({ company: company._id });
    const total = tickets.length;

    const byStatus = {};
    const byCategory = {};
    const byPriority = {};
    let csatSum = 0;
    let csatCount = 0;

    tickets.forEach((t) => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
      if (t.csat && t.csat.rating) {
        csatSum += t.csat.rating;
        csatCount++;
      }
    });

    const resolved = (byStatus['Resolved'] || 0) + (byStatus['Closed'] || 0);
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0.0';
    const avgCsat = csatCount > 0 ? (csatSum / csatCount).toFixed(1) : 'N/A';

    // SLA compliance
    const now = new Date();
    const slaBreached = tickets.filter(
      (t) => !['Resolved', 'Closed'].includes(t.status) && t.slaDeadline && new Date(t.slaDeadline) < now
    ).length;
    const slaCompliance = total > 0 ? (((total - slaBreached) / total) * 100).toFixed(1) : '100.0';

    // Recent tickets
    const recentTickets = await Ticket.find({ company: company._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // High priority watchlist
    const escalationWatch = await Ticket.find({
      company: company._id,
      priority: { $in: ['High', 'Critical'] },
      status: { $nin: ['Resolved', 'Closed'] },
    }).sort({ createdAt: -1 });

    const employeeCount = await User.countDocuments({
      company: company._id,
      role: 'employee',
      status: 'active',
    });

    res.json({
      total,
      byStatus,
      byCategory,
      byPriority,
      resolutionRate,
      avgCsat,
      slaCompliance,
      slaBreached,
      recentTickets,
      escalationWatch,
      employeeCount,
    });
  } catch (err) {
    console.error('Company dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ─── PUT /api/companies/:slug/branding ─── Update branding (developer only)
router.put('/branding', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { name, logo, branding } = req.body;
    if (name) company.name = name.trim();
    if (logo !== undefined) company.logo = logo;
    if (branding) {
      if (branding.primaryColor) company.branding.primaryColor = branding.primaryColor;
      if (branding.accentColor) company.branding.accentColor = branding.accentColor;
      if (branding.welcomeMessage !== undefined) company.branding.welcomeMessage = branding.welcomeMessage;
      if (branding.tagline !== undefined) company.branding.tagline = branding.tagline;
    }

    await company.save();
    res.json(company);
  } catch (err) {
    console.error('Update branding error:', err);
    res.status(500).json({ error: 'Failed to update branding' });
  }
});

// ─── Employee Management (Developer only) ───

// GET /api/companies/:slug/employees
router.get('/employees', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const employees = await User.find({ company: company._id, role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Add ticket counts per employee
    const enriched = await Promise.all(
      employees.map(async (emp) => {
        const assignedTickets = await Ticket.countDocuments({ assignedTo: emp._id });
        return { ...emp.toObject(), assignedTickets };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('List employees error:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/companies/:slug/employees
router.post('/employees', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'employee',
      company: company._id,
      department: department || '',
    });

    const result = await User.findById(employee._id).select('-password');
    res.status(201).json(result);
  } catch (err) {
    console.error('Create employee error:', err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/companies/:slug/employees/:id
router.put('/employees/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const { name, department, status } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (department !== undefined) updates.department = department;
    if (status) updates.status = status;

    const employee = await User.findOneAndUpdate(
      { _id: req.params.id, company: req.company?._id || (await getCompany(req, res))?._id, role: 'employee' },
      updates,
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error('Update employee error:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/companies/:slug/employees/:id (dismiss)
router.delete('/employees/:id', authenticate, authorize('developer', 'superadmin'), authorizeCompany, async (req, res) => {
  try {
    const company = await getCompany(req, res);
    if (!company) return;

    const employee = await User.findOneAndUpdate(
      { _id: req.params.id, company: company._id, role: 'employee' },
      { status: 'dismissed' },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found in this company' });
    }

    // Unassign their open tickets
    await Ticket.updateMany(
      { assignedTo: employee._id, status: { $nin: ['Resolved', 'Closed'] } },
      { assignedTo: null }
    );

    res.json({ message: `Employee "${employee.name}" has been dismissed`, employee });
  } catch (err) {
    console.error('Dismiss employee error:', err);
    res.status(500).json({ error: 'Failed to dismiss employee' });
  }
});

export default router;
