require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const eventTypeRoutes = require('./routes/eventTypeRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const publicRoutes = require('./routes/publicRoutes');
const publicController = require('./controllers/publicController');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Calendly Clone API is running', timestamp: new Date().toISOString() });
});

// Admin routes
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);

// Public routes
app.use('/api/event', publicRoutes);
app.post('/api/book', publicController.book);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Calendly Clone API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
