import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';
import Registration from './models/Registration.js';

dotenv.config();

// Force DNS to use Google DNS servers (fixes SRV lookup issues on restrictive networks)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ─── Connect MongoDB ───
mongoose.connect(process.env.MONGODB_URI, {
  family: 4, // Force IPv4 (fixes DNS SRV issues on some networks)
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ─── ROUTES ───

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Register a team leader
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, rollNo, branch, mobile, event } = req.body;

    // Basic validation
    if (!fullName || !rollNo || !branch || !mobile || !event) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const registration = new Registration({ fullName, rollNo, branch, mobile, event });
    await registration.save();

    res.status(201).json({ message: 'Registration successful!', data: registration });
  } catch (err) {
    // Duplicate entry
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already registered for this event with this roll number.' });
    }
    // Validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again or use the Google Form.' });
  }
});

// ─── ADMIN ROUTES ───

// Simple admin auth middleware (email + password)
const adminAuth = (req, res, next) => {
  const id = req.headers['x-admin-id'];
  const password = req.headers['x-admin-password'];
  if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all registrations (with optional event filter)
app.get('/api/admin/registrations', adminAuth, async (req, res) => {
  try {
    const { event } = req.query;
    const filter = event ? { event } : {};
    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get stats (total count + per-event counts)
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const total = await Registration.countDocuments();
    const perEvent = await Registration.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get recent registrations (last 10)
    const recent = await Registration.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      total,
      perEvent: perEvent.map(e => ({ event: e._id, count: e.count })),
      recent,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Delete a registration (admin)
app.delete('/api/admin/registrations/:id', adminAuth, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// ─── START ───
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
