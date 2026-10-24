import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default: '', // URL or base64
    },
    industry: {
      type: String,
      default: 'General',
    },
    branding: {
      primaryColor: { type: String, default: '#25221f' },
      accentColor: { type: String, default: '#8c6a46' },
      welcomeMessage: { type: String, default: 'Welcome to our Support Center' },
      tagline: { type: String, default: 'We are here to help you' },
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    ticketPrefix: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },
    ticketCounter: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate ticketPrefix from slug if not set
companySchema.pre('save', function () {
  if (!this.ticketPrefix) {
    this.ticketPrefix = this.slug
      .split('-')
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 4) || 'TKT';
  }
});

/**
 * Generate next ticket ID for this company
 * e.g., TATA-2026-0001
 */
companySchema.methods.generateTicketId = async function () {
  this.ticketCounter += 1;
  await this.save();
  const year = new Date().getFullYear();
  const num = String(this.ticketCounter).padStart(4, '0');
  return `${this.ticketPrefix}-${year}-${num}`;
};

export const Company = mongoose.model('Company', companySchema);
