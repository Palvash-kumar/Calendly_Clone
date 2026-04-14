import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Event Types ──────────────────────────────────────────
export const eventTypeAPI = {
  getAll: () => api.get('/event-types'),
  getById: (id) => api.get(`/event-types/${id}`),
  create: (data) => api.post('/event-types', data),
  update: (id, data) => api.put(`/event-types/${id}`, data),
  delete: (id) => api.delete(`/event-types/${id}`),
};

// ─── Availability ─────────────────────────────────────────
export const availabilityAPI = {
  getAll: () => api.get('/availability'),
  set: (schedules) => api.post('/availability', { schedules }),
};

// ─── Public Booking ───────────────────────────────────────
export const publicAPI = {
  getEvent: (slug) => api.get(`/event/${slug}`),
  getSlots: (slug, date) => api.get(`/event/${slug}/slots`, { params: { date } }),
  book: (data) => api.post('/book', data),
};

// ─── Bookings / Meetings ─────────────────────────────────
export const bookingAPI = {
  getAll: (type = 'upcoming') => api.get('/bookings', { params: { type } }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export default api;
