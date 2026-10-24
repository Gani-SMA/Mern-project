import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'HelpCircle', // Lucide icon name
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for company-scoped queries
categorySchema.index({ company: 1, isActive: 1 });

export const Category = mongoose.model('Category', categorySchema);
