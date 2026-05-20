'use client';

import { ArrowRight, Calendar, Check, Download, Heart, Settings, Star, Zap } from 'lucide-react';

export default function GlassDemoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #f0f6ff 0%, #e8f0fe 25%, #f9fafb 55%, #fff 100%)',
      padding: '60px 24px',
    }}>
      {/* Decorative blobs for glass to refract through */}
      <div style={{
        position: 'fixed', top: '-120px', right: '-80px', width: '400px', height: '400px',
        borderRadius: '50%', background: 'radial-gradient(circle, #006BFF 0%, transparent 70%)',
        filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-60px', width: '350px', height: '350px',
        borderRadius: '50%', background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)',
        filter: 'blur(80px)', opacity: 0.12, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', top: '40%', left: '50%', width: '300px', height: '300px',
        borderRadius: '50%', background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)',
        filter: 'blur(100px)', opacity: 0.08, pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 8, textAlign: 'center' }}>
          Liquid Glass Design System
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 17, marginBottom: 56, lineHeight: 1.6 }}>
          macOS-inspired frosted glass effect across all UI elements
        </p>

        {/* ── Buttons ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Buttons</h2>

          <div className="card glass" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Primary */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Primary</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm">Small</button>
                <button className="btn btn-primary">Default <ArrowRight size={16} /></button>
                <button className="btn btn-primary btn-lg">Large Button</button>
                <button className="btn btn-primary" disabled>Disabled</button>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Secondary</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <button className="btn btn-secondary btn-sm">Cancel</button>
                <button className="btn btn-secondary">Secondary <Settings size={16} /></button>
                <button className="btn btn-secondary btn-lg">Learn More</button>
              </div>
            </div>

            {/* Ghost */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Ghost</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <button className="btn btn-ghost btn-sm"><Heart size={14} /> Like</button>
                <button className="btn btn-ghost">Ghost Button</button>
                <button className="btn btn-ghost btn-lg"><Star size={16} /> Favorite</button>
              </div>
            </div>

            {/* Danger */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Danger</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <button className="btn btn-danger btn-sm">Remove</button>
                <button className="btn btn-danger">Delete Account</button>
              </div>
            </div>

            {/* Landing style */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Landing</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <a href="#" className="landing-btn landing-btn--primary landing-btn--sm">Get Started <Zap size={16} /></a>
                <a href="#" className="landing-btn landing-btn--glass">See How It Works</a>
                <a href="#" className="landing-btn landing-btn--primary landing-btn--lg">Sign Up Free <ArrowRight size={18} /></a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cards ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { icon: <Calendar size={24} />, title: 'Schedule', desc: 'Manage your calendar with ease', color: '#006BFF' },
              { icon: <Zap size={24} />, title: 'Automate', desc: 'Set rules and let it handle the rest', color: '#059669' },
              { icon: <Download size={24} />, title: 'Export', desc: 'Download reports in any format', color: '#FF6B00' },
            ].map((c) => (
              <div key={c.title} className="card glass">
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', marginBottom: 16, boxShadow: `0 4px 12px ${c.color}30`,
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Inputs ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Form Elements</h2>
          <div className="card glass" style={{ padding: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div>
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Full Name</label>
                <input className="input" type="text" placeholder="John Doe" />
              </div>
            </div>
            <button className="btn btn-primary">Submit <Check size={16} /></button>
          </div>
        </section>

        {/* ── Badges ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Badges</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span className="badge badge-blue">Active</span>
            <span className="badge badge-green">Confirmed</span>
            <span className="badge badge-red">Cancelled</span>
            <span className="badge badge-gray">Pending</span>
          </div>
        </section>
      </div>
    </div>
  );
}
