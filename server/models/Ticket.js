import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ['customer', 'agent'], required: true },
    author: { type: String, required: true },
    timestamp: { type: String, required: true },
    text: { type: String, required: true },
    isInternal: { type: Boolean, default: false },
  },
  { _id: false }
);

const timelineNodeSchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    time: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
  },
  { _id: false }
);

const csatSchema = new mongoose.Schema(
  {
    stars: { type: Number, min: 1, max: 5 },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'Under Investigation', 'Escalated', 'Resolved', 'Closed'],
      default: 'Open',
    },
    slaHours: {
      type: Number,
      default: 24,
    },
    deadline: {
      type: Date,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: 'N/A' },
      orderRef: { type: String, default: 'N/A' },
    },
    incidentDate: {
      type: String,
    },
    desiredResolution: {
      type: String,
      default: 'Standard Remediation',
    },
    description: {
      type: String,
      required: true,
    },
    securityHash: {
      type: String,
    },
    assignedOfficer: {
      type: String,
      default: 'Pending Automated Assignment',
    },
    sentiment: {
      type: String,
      default: 'Neutral Grievance',
    },
    attachments: [attachmentSchema],
    csat: csatSchema,
    timeline: [timelineNodeSchema],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
