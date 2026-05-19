require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const passport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventTypeRoutes = require('./routes/eventTypeRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const publicRoutes = require('./routes/publicRoutes');
const publicController = require('./controllers/publicController');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────
// Helmet: sets various HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API-only backend
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false, // Required for OAuth redirects to Google
}));

// Prevent HTTP parameter pollution
app.use(hpp());

// CORS — hardened configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours preflight cache
}));

// Body parser with size limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(passport.initialize());

// Global API rate limiter
app.use('/api', apiLimiter);

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

// Auth routes (with stricter rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Protected routes
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile', profileRoutes);

// Admin routes (require auth + admin check)
app.use('/api/admin', adminRoutes);

// Public routes (event details and slots — no auth required)
app.use('/api/event', publicRoutes);

// Booking route — requires auth (invitee must be logged in)
const authMiddleware = require('./middleware/authMiddleware');
app.post('/api/book', authMiddleware, publicController.book);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

const { startReminderScheduler } = require('./services/reminderScheduler');

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Calendly Clone API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);

  // Start the 30-minute reminder cron job
  startReminderScheduler();
});

module.exports = app;
