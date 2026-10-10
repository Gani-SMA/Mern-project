import express from 'express';
import { Ticket } from '../models/Ticket.js';
import { INITIAL_TICKETS } from '../data/initialData.js';

const router = express.Router();

// Helper to format timestamp
const getTimeStr = () => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};

// GET all tickets
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (priority && priority !== 'ALL') {
      filter.priority = priority;
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { id: regex },
        { title: regex },
        { 'customer.name': regex },
        { 'customer.orderRef': regex },
        { description: regex },
      ];
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to retrieve tickets from database' });
  }
});

// GET single ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket docket not found' });
    }
    res.json(ticket);
  } catch (err) {
    console.error('Error fetching ticket by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve ticket record' });
  }
});

// POST create new ticket
router.post('/', async (req, res) => {
  try {
    const ticketData = req.body;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `RES-2026-${randomNum}`;

    let slaHours = 24;
    if (ticketData.priority === 'Critical') slaHours = 6;
    else if (ticketData.priority === 'High') slaHours = 12;
    else if (ticketData.priority === 'Medium') slaHours = 24;
    else slaHours = 48;

    const now = new Date();
    const deadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

    const newTicket = new Ticket({
      id: newId,
      title: ticketData.title,
      category: ticketData.category,
      priority: ticketData.priority || 'Medium',
      status: 'Open',
      slaHours: slaHours,
      deadline: deadline,
      customer: {
        name: ticketData.custName || ticketData.customer?.name || 'Anonymous Complainant',
        email: ticketData.custEmail || ticketData.customer?.email || 'N/A',
        phone: ticketData.custPhone || ticketData.customer?.phone || 'N/A',
        orderRef: ticketData.orderRef || ticketData.customer?.orderRef || 'N/A',
      },
      incidentDate: ticketData.incidentDate || now.toISOString().split('T')[0],
      desiredResolution: ticketData.desiredResolution || 'Standard Remediation',
      description: ticketData.description,
      securityHash: '0x' + Math.random().toString(16).substr(2, 8).toUpperCase(),
      assignedOfficer: 'Pending Automated Assignment',
      sentiment: ticketData.sentiment || 'Neutral Grievance',
      attachments: ticketData.attachments || [],
      csat: null,
      timeline: [
        {
          step: 'Grievance Lodged',
          time: getTimeStr(),
          desc: 'Ticket registered into ResolveIT Redressal Pipeline via MongoDB Atlas.',
        },
      ],
      messages: [],
    });

    const saved = await newTicket.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Failed to record grievance in database' });
  }
});

// PUT update ticket
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ticket = await Ticket.findOne({ id: id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket docket not found' });
    }

    const timeStr = getTimeStr();

    if (updates.status && updates.status !== ticket.status) {
      ticket.timeline.push({
        step: `Status Changed to ${updates.status}`,
        time: timeStr,
        desc: `Case state updated to ${updates.status} by ${updates.assignedOfficer || 'Support Officer'}.`,
      });
      ticket.status = updates.status;
    }

    if (updates.priority && updates.priority !== ticket.priority) {
      ticket.timeline.push({
        step: `Priority Adjusted to ${updates.priority}`,
        time: timeStr,
        desc: `Severity level reclassified to ${updates.priority}.`,
      });
      ticket.priority = updates.priority;
    }

    if (updates.assignedOfficer) {
      ticket.assignedOfficer = updates.assignedOfficer;
    }

    if (updates.desiredResolution) {
      ticket.desiredResolution = updates.desiredResolution;
    }

    const updated = await ticket.save();
    res.json(updated);
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: 'Failed to update ticket dossier' });
  }
});

// POST add message
router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, author, text, isInternal } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    const ticket = await Ticket.findOne({ id: id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: sender || 'customer',
      author: author || 'Authorized Party',
      timestamp: getTimeStr(),
      text: text.trim(),
      isInternal: Boolean(isInternal),
    };

    ticket.messages.push(newMsg);
    await ticket.save();

    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Failed to post message to case file' });
  }
});

// POST escalate ticket
router.post('/:id/escalate', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findOne({ id: id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const timeStr = getTimeStr();
    ticket.status = 'Escalated';
    ticket.priority = 'Critical';
    ticket.assignedOfficer = 'Priya Patel (Consumer Ombudsman)';
    ticket.timeline.push({
      step: 'Direct Escalation to Executive Ombudsman',
      time: timeStr,
      desc: reason || 'Customer invoked statutory escalation clause. Fast-tracked for executive dispute resolution.',
    });

    const updated = await ticket.save();
    res.json(updated);
  } catch (err) {
    console.error('Error escalating ticket:', err);
    res.status(500).json({ error: 'Failed to escalate ticket' });
  }
});

// POST CSAT rating
router.post('/:id/csat', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const ticket = await Ticket.findOne({ id: id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const timeStr = getTimeStr();
    ticket.csat = {
      stars: rating,
      feedback: feedback || 'No written comment provided',
      submittedAt: new Date(),
    };
    ticket.timeline.push({
      step: 'Customer CSAT Verified',
      time: timeStr,
      desc: `Customer rated resolution ${rating}/5 stars.`,
    });

    const updated = await ticket.save();
    res.json(updated);
  } catch (err) {
    console.error('Error submitting CSAT:', err);
    res.status(500).json({ error: 'Failed to record customer satisfaction feedback' });
  }
});

// POST reset tickets in MongoDB to default baseline
router.post('/reset', async (req, res) => {
  try {
    await Ticket.deleteMany({});
    await Ticket.insertMany(INITIAL_TICKETS);
    const resetTickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.json({ message: 'Database tickets restored to official initial baseline', tickets: resetTickets });
  } catch (err) {
    console.error('Error resetting tickets:', err);
    res.status(500).json({ error: 'Failed to reset ticket records' });
  }
});

export default router;
