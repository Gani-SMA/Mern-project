import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null, // null for Google OAuth customers
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    avatar: {
      type: String,
      default: '', // Google profile picture URL
    },
    role: {
      type: String,
      enum: ['superadmin', 'developer', 'employee', 'customer'],
      required: true,
      default: 'customer',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null, // null for superadmin & customers
    },
    department: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'dismissed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
userSchema.index({ role: 1, company: 1 });

export const User = mongoose.model('User', userSchema);
