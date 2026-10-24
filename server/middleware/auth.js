import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'resolveit_jwt_fallback_secret_key';

/**
 * Verify JWT token and attach user to req.user
 * Usage: router.get('/protected', authenticate, handler)
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found. Token is invalid.' });
    }

    if (user.status === 'dismissed') {
      return res.status(403).json({ error: 'Account has been deactivated.' });
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    req.userCompany = user.company;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please sign in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

/**
 * Role-based authorization middleware
 * Usage: router.get('/admin-only', authenticate, authorize('superadmin'), handler)
 * Usage: router.get('/team', authenticate, authorize('developer', 'employee'), handler)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

/**
 * Verify that the user belongs to the company in the URL (:slug)
 * Superadmin bypasses this check.
 * Usage: router.get('/companies/:slug/tickets', authenticate, authorizeCompany, handler)
 */
export const authorizeCompany = async (req, res, next) => {
  try {
    // Superadmin can access any company
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Customers don't belong to a company — they access via slug differently
    if (req.user.role === 'customer') {
      return next();
    }

    // Developer or Employee must belong to the company in the URL
    const { slug } = req.params;
    if (!slug) {
      return next(); // No slug in URL, skip company check
    }

    // Import Company here to avoid circular dependency
    const { Company } = await import('../models/Company.js');
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Check if user's company matches
    if (!req.user.company || req.user.company.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You do not belong to this company.' });
    }

    // Attach company to request for downstream use
    req.company = company;
    next();
  } catch (err) {
    console.error('Company authorization error:', err);
    return res.status(500).json({ error: 'Authorization check failed.' });
  }
};

/**
 * Generate JWT token for a user
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      company: user.company,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};
