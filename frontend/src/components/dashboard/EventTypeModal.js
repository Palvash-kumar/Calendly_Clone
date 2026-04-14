'use client';

import { useState, useEffect } from 'react';

/**
 * Modal dialog for creating or editing an event type.
 */
export default function EventTypeModal({ isOpen, onClose, onSave, eventType }) {
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    slug: '',
    color: '#006BFF',
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!eventType;

  useEffect(() => {
    if (eventType) {
      setFormData({
        name: eventType.name,
        duration: eventType.duration,
        slug: eventType.slug,
        color: eventType.color || '#006BFF',
      });
    } else {
      setFormData({ name: '', duration: 30, slug: '', color: '#006BFF' });
    }
  }, [eventType, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const colors = ['#006BFF', '#FF6B00', '#00C853', '#7C3AED', '#E91E63', '#00BCD4', '#FF5722', '#607D8B'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold m-0">
              {isEditing ? 'Edit Event Type' : 'New Event Type'}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost p-1.5 rounded-lg"
              id="close-event-modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-5">
            {/* Event Name */}
            <div>
              <label className="label" htmlFor="event-name">Event Name</label>
              <input
                id="event-name"
                type="text"
                className="input"
                placeholder="e.g. 30 Minute Meeting"
                value={formData.name}
                onChange={handleNameChange}
                required
                autoFocus
              />
            </div>

            {/* Duration */}
            <div>
              <label className="label" htmlFor="event-duration">Duration (minutes)</label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`btn btn-sm flex-1 ${
                      formData.duration === d ? 'btn-primary' : 'btn-secondary'
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, duration: d }))}
                  >
                    {d} min
                  </button>
                ))}
              </div>
              <input
                id="event-duration"
                type="number"
                className="input mt-2"
                placeholder="Custom duration"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                min="5"
                max="480"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="label" htmlFor="event-slug">URL Slug</label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-2.5 bg-[var(--bg-tertiary)] border border-r-0 border-[var(--border)] rounded-l-[var(--radius-md)] text-sm text-[var(--text-muted)]">
                  /event/
                </span>
                <input
                  id="event-slug"
                  type="text"
                  className="input rounded-l-none"
                  placeholder="my-meeting"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="label">Color</label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: formData.color === color ? 'var(--text-primary)' : 'transparent',
                      transform: formData.color === color ? 'scale(1.15)' : 'scale(1)',
                    }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              id="cancel-event-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.name || !formData.slug || !formData.duration}
              id="save-event-type"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditing ? 'Save Changes' : 'Create Event Type'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
