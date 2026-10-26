import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for ordered company-scoped queries
faqSchema.index({ company: 1, order: 1 });

export const FAQ = mongoose.model('FAQ', faqSchema);
