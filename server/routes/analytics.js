import express from 'express';
import { Ticket } from '../models/Ticket.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    const total = tickets.length;

    const open = tickets.filter((t) => t.status === 'Open').length;
    const investigating = tickets.filter((t) => t.status === 'Under Investigation').length;
    const escalated = tickets.filter((t) => t.status === 'Escalated').length;
    const resolved = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

    const categoryCounts = {};
    tickets.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const ratedTickets = tickets.filter((t) => t.csat && t.csat.stars);
    const avgCsat =
      ratedTickets.length > 0
        ? (ratedTickets.reduce((acc, curr) => acc + curr.csat.stars, 0) / ratedTickets.length).toFixed(1)
        : '4.9';

    const resolvedRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '100.0';

    res.json({
      total,
      open,
      investigating,
      escalated,
      resolved,
      active: open + investigating,
      resolvedRate,
      avgCsat,
      categoryCounts,
    });
  } catch (err) {
    console.error('Error calculating analytics:', err);
    res.status(500).json({ error: 'Failed to compute analytics from database' });
  }
});

export default router;
