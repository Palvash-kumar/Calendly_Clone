'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/utils/auth';
import {
  Calendar, Clock, Video, Edit3, Link2, ArrowRight,
  CheckCircle2, Shield, ChevronLeft, ChevronRight,
  Users, Zap, Globe, Lock, Star, Menu, X
} from 'lucide-react';

/* ───────── Intersection Observer Hook ───────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView];
}

/* ───────── Animated Counter ───────── */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ───────── Feature data ───────── */
const steps = [
  {
    num: '01',
    title: 'Connect your calendars',
    desc: 'Calendly connects up to six calendars to automate scheduling with real-time availability.',
    Icon: Calendar,
    gradient: 'linear-gradient(135deg, #006BFF 0%, #0052CC 100%)',
  },
  {
    num: '02',
    title: 'Set your availability',
    desc: 'Control your calendar with detailed availability settings, scheduling rules, buffers, and more.',
    Icon: Clock,
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  },
  {
    num: '03',
    title: 'Connect conferencing',
    desc: 'Sync your video conferencing tools and set preferences for in-person meetings or calls.',
    Icon: Video,
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
  },
  {
    num: '04',
    title: 'Customize event types',
    desc: 'Choose from pre-built templates or create custom event types for any meeting you need.',
    Icon: Edit3,
    gradient: 'linear-gradient(135deg, #FF6B00 0%, #E65100 100%)',
  },
  {
    num: '05',
    title: 'Share your link',
    desc: 'Easily book meetings by embedding scheduling links on your website, landing pages, or emails.',
    Icon: Link2,
    gradient: 'linear-gradient(135deg, #0D9488 0%, #006BFF 100%)',
  },
];

const integrations = [
  { name: 'Google Calendar', color: '#4285F4', icon: 'G' },
  { name: 'Microsoft Teams', color: '#6264A7', icon: 'T' },
  { name: 'Zoom', color: '#2D8CFF', icon: 'Z' },
  { name: 'Salesforce', color: '#00A1E0', icon: 'S' },
  { name: 'Slack', color: '#4A154B', icon: 'S' },
  { name: 'HubSpot', color: '#FF7A59', icon: 'H' },
  { name: 'Outlook', color: '#0078D4', icon: 'O' },
  { name: 'Zapier', color: '#FF4A00', icon: 'Z' },
];

const testimonials = [
  {
    quote: 'Calendly has completely transformed how our team handles client meetings. We save over 10 hours per week on scheduling alone.',
    name: 'Sarah Chen',
    role: 'VP of Sales, TechCorp',
    avatar: 'SC',
  },
  {
    quote: 'The integration with our existing tools was seamless. Our booking rate increased by 40% within the first month.',
    name: 'Marcus Rivera',
    role: 'Founder, GrowthLab',
    avatar: 'MR',
  },
  {
    quote: 'Enterprise-grade security with the simplicity our team needed. Best scheduling tool we have ever used.',
    name: 'Aisha Patel',
    role: 'CTO, ScaleUp Inc',
    avatar: 'AP',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    note: 'Always free',
    tagline: 'For individuals getting started',
    features: ['1 calendar connection', '1 event type', 'Unlimited 1-on-1 meetings', 'Customizable booking link'],
  },
  {
    name: 'Standard',
    price: '$10',
    note: '/seat/month',
    tagline: 'For growing professionals',
    features: ['6 calendar connections', 'Unlimited event types', 'Group events', 'Custom notifications', 'Integrations'],
    highlight: true,
  },
  {
    name: 'Teams',
    price: '$16',
    note: '/seat/month',
    tagline: 'For collaborative teams',
    features: ['Everything in Standard', 'Round robin scheduling', 'Collective events', 'Team analytics', 'Admin management'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: 'Contact us',
    tagline: 'For large organizations',
    features: ['Everything in Teams', 'SSO / SAML', 'Advanced security', 'Dedicated support', 'Custom integrations'],
  },
];


/* ═══════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  /* Check auth state — but do NOT redirect */
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  /* Navbar scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Prevent body scroll when mobile nav open */
  useEffect(() => {
    document.body.style.overflow = mobileNav ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNav]);

  /* Section refs for scroll-in animations */
  const [heroRef, heroVisible] = useInView();
  const [stepsRef, stepsVisible] = useInView();
  const [intRef, intVisible] = useInView();
  const [testRef, testVisible] = useInView();
  const [priceRef, priceVisible] = useInView();
  const [secRef, secVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  return (
    <div className="landing-page">
      {/* ════════ NAVBAR ════════ */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`} id="landing-navbar">
        <div className="landing-nav__inner">
          {/* Logo */}
          <Link href="/" className="landing-nav__logo" id="landing-logo">
            <div className="landing-nav__logo-icon">
              <Calendar size={22} color="white" strokeWidth={2.5} />
            </div>
            <span className="landing-nav__logo-text">Calendly</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="landing-nav__links">
            <a href="#features" className="landing-nav__link">Features</a>
            <a href="#integrations" className="landing-nav__link">Integrations</a>
            <a href="#testimonials" className="landing-nav__link">Testimonials</a>
            <a href="#pricing" className="landing-nav__link">Pricing</a>
            <a href="#security" className="landing-nav__link">Security</a>
          </div>

          {/* Actions */}
          <div className="landing-nav__actions">
            {loggedIn ? (
              <Link href="/dashboard" className="landing-btn landing-btn--primary landing-btn--sm" id="landing-dashboard">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="landing-nav__link" id="landing-login">Log In</Link>
                <Link href="/login" className="landing-btn landing-btn--primary landing-btn--sm" id="landing-signup">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="landing-nav__hamburger"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
            id="landing-mobile-toggle"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileNav && (
        <div className="landing-mobile-overlay" onClick={() => setMobileNav(false)}>
          <div className="landing-mobile-drawer" onClick={e => e.stopPropagation()}>
            <button className="landing-mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu">
              <X size={24} />
            </button>
            <div className="landing-mobile-links">
              <a href="#features" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Features</a>
              <a href="#integrations" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Integrations</a>
              <a href="#testimonials" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Testimonials</a>
              <a href="#pricing" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Pricing</a>
              <a href="#security" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Security</a>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', margin: '16px 0' }} />
              {loggedIn ? (
                <Link href="/dashboard" className="landing-btn landing-btn--primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setMobileNav(false)}>
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="landing-mobile-link" onClick={() => setMobileNav(false)}>Log In</Link>
                  <Link href="/login" className="landing-btn landing-btn--primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setMobileNav(false)}>
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ════════ HERO SECTION ════════ */}
      <section className="landing-hero" id="hero">
        {/* Floating gradient blobs */}
        <div className="landing-hero__blob landing-hero__blob--1" />
        <div className="landing-hero__blob landing-hero__blob--2" />
        <div className="landing-hero__blob landing-hero__blob--3" />

        <div ref={heroRef} className={`landing-hero__content ${heroVisible ? 'landing-visible' : ''}`}>
          <div className="landing-hero__badge">
            <span className="landing-hero__badge-dot" />
            Easy scheduling ahead
          </div>

          <h1 className="landing-hero__title">
            Scheduling made <span className="landing-gradient-text">simple</span> for <span className="landing-gradient-text-alt">everyone</span>
          </h1>

          <p className="landing-hero__subtitle">
            Calendly is the modern scheduling platform that makes &ldquo;finding time&rdquo; a breeze. When connecting is easy, your teams can get more done.
          </p>

          <div className="landing-hero__actions">
            <Link href="/login" className="landing-btn landing-btn--primary landing-btn--lg" id="hero-signup">
              Sign up for free
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="landing-btn landing-btn--glass landing-btn--lg" id="hero-demo">
              See how it works
            </a>
          </div>

          <p className="landing-hero__note">Free forever — No credit card required</p>
        </div>

        {/* Hero visual — CSS-based scheduling widget mockup */}
        <div className={`landing-hero__visual ${heroVisible ? 'landing-visible' : ''}`}>
          <div className="landing-hero__widget">
            {/* Widget header */}
            <div className="landing-widget__header">
              <div className="landing-widget__avatar">
                <Users size={22} color="white" />
              </div>
              <div>
                <div className="landing-widget__name">Palvash Kumar</div>
                <div className="landing-widget__event">30 Minute Meeting</div>
              </div>
            </div>
            {/* Mini calendar */}
            <div className="landing-widget__calendar">
              <div className="landing-widget__month">
                <ChevronLeft size={16} />
                <span>May 2026</span>
                <ChevronRight size={16} />
              </div>
              <div className="landing-widget__days">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span key={d} className="landing-widget__day-label">{d}</span>
                ))}
              </div>
              <div className="landing-widget__dates">
                {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                  <span
                    key={d}
                    className={`landing-widget__date ${d === 18 ? 'landing-widget__date--selected' : ''} ${[3,4,10,11,17,24,25,31].includes(d) ? 'landing-widget__date--disabled' : ''}`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
            {/* Time slots */}
            <div className="landing-widget__slots">
              <div className="landing-widget__slot-title">Available Times</div>
              {['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM'].map((t, i) => (
                <div key={t} className={`landing-widget__slot ${i === 1 ? 'landing-widget__slot--active' : ''}`}>{t}</div>
              ))}
            </div>
          </div>

          {/* Floating badges around widget */}
          <div className="landing-hero__float landing-hero__float--1">
            <CheckCircle2 size={18} color="#059669" />
            <span>Meeting Confirmed!</span>
          </div>
          <div className="landing-hero__float landing-hero__float--2">
            <Globe size={18} color="#006BFF" />
            <span>Calendar Synced</span>
          </div>
          <div className="landing-hero__float landing-hero__float--3">
            <Users size={18} color="#0D9488" />
            <span>Team Booking</span>
          </div>
        </div>
      </section>


      {/* ════════ TRUSTED BY ════════ */}
      <section className="landing-trusted">
        <p className="landing-trusted__label">Trusted by 86% of Fortune 500 companies</p>
        <div className="landing-trusted__logos">
          {['Twilio', 'Dropbox', 'Lyft', 'Compass', 'eBay', 'Vonage'].map(name => (
            <span key={name} className="landing-trusted__logo">{name}</span>
          ))}
        </div>
      </section>


      {/* ════════ FEATURES / HOW IT WORKS ════════ */}
      <section className="landing-section" id="features">
        <div ref={stepsRef} className={`landing-section__header ${stepsVisible ? 'landing-visible' : ''}`}>
          <span className="landing-section__tag">How it works</span>
          <h2 className="landing-section__title">Get started in five simple steps</h2>
          <p className="landing-section__subtitle">From connecting your calendar to sharing your link — set up takes just minutes.</p>
        </div>

        <div className="landing-steps">
          {steps.map((step, i) => {
            const [ref, visible] = useInView();
            const StepIcon = step.Icon;
            return (
              <div
                key={step.num}
                ref={ref}
                className={`landing-step ${visible ? 'landing-visible' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="landing-step__icon" style={{ background: step.gradient }}>
                  <StepIcon size={28} color="white" strokeWidth={1.8} />
                </div>
                <div className="landing-step__num">{step.num}</div>
                <h3 className="landing-step__title">{step.title}</h3>
                <p className="landing-step__desc">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* ════════ INTEGRATIONS ════════ */}
      <section className="landing-section landing-section--alt" id="integrations">
        <div ref={intRef} className={`landing-section__header ${intVisible ? 'landing-visible' : ''}`}>
          <span className="landing-section__tag">Integrations</span>
          <h2 className="landing-section__title">Connect to the tools you already use</h2>
          <p className="landing-section__subtitle">Boost productivity with 100+ integrations across your favorite platforms.</p>
        </div>

        <div className="landing-integrations">
          {integrations.map((int, i) => {
            const [ref, visible] = useInView();
            return (
              <div
                key={int.name}
                ref={ref}
                className={`landing-integration ${visible ? 'landing-visible' : ''}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="landing-integration__icon" style={{ background: int.color }}>
                  {int.icon}
                </div>
                <span className="landing-integration__name">{int.name}</span>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="#" className="landing-btn landing-btn--glass">
            View all integrations <ArrowRight size={18} />
          </a>
        </div>
      </section>


      {/* ════════ TESTIMONIALS ════════ */}
      <section className="landing-section" id="testimonials">
        <div ref={testRef} className={`landing-section__header ${testVisible ? 'landing-visible' : ''}`}>
          <span className="landing-section__tag">Testimonials</span>
          <h2 className="landing-section__title">Loved by teams worldwide</h2>
          <p className="landing-section__subtitle">See what our customers have to say about their experience.</p>
        </div>

        <div className="landing-steps" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {testimonials.map((t, i) => {
            const [ref, visible] = useInView();
            return (
              <div
                key={t.name}
                ref={ref}
                className={`landing-step ${visible ? 'landing-visible' : ''}`}
                style={{ animationDelay: `${i * 120}ms`, textAlign: 'center' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24, fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #006BFF, #0D9488)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 14, fontWeight: 700,
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ════════ PRICING ════════ */}
      <section className="landing-section landing-section--alt" id="pricing">
        <div ref={priceRef} className={`landing-section__header ${priceVisible ? 'landing-visible' : ''}`}>
          <span className="landing-section__tag">Pricing</span>
          <h2 className="landing-section__title">Simple, transparent pricing</h2>
          <p className="landing-section__subtitle">Start free and scale as you grow. No hidden fees.</p>
        </div>

        <div className="landing-pricing">
          {pricingPlans.map((plan, i) => {
            const [ref, visible] = useInView();
            return (
              <div
                key={plan.name}
                ref={ref}
                className={`landing-price-card ${plan.highlight ? 'landing-price-card--highlight' : ''} ${visible ? 'landing-visible' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {plan.highlight && (
                  <div className="landing-price-card__badge">Most Popular</div>
                )}
                <h3 className="landing-price-card__name">{plan.name}</h3>
                <p className="landing-price-card__tagline">{plan.tagline}</p>
                <div className="landing-price-card__price">
                  {plan.price}
                  <span className="landing-price-card__note"> {plan.note}</span>
                </div>
                <ul className="landing-price-card__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <CheckCircle2 size={16} color="#059669" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`landing-btn ${plan.highlight ? 'landing-btn--primary' : 'landing-btn--glass'}`}
                  style={{ width: '100%' }}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>


      {/* ════════ SECURITY ════════ */}
      <section className="landing-section" id="security">
        <div ref={secRef} className={`landing-security ${secVisible ? 'landing-visible' : ''}`}>
          <div className="landing-security__content">
            <span className="landing-section__tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Enterprise Security</span>
            <h2 className="landing-security__title">Built to keep your organization secure</h2>
            <p className="landing-security__desc">
              Keep your scheduling data secure with enterprise-grade admin management, security integrations, data governance, compliance audits, and privacy protections.
            </p>
            <div className="landing-security__badges">
              {['SOC 2', 'GDPR', 'SSO/SAML', 'SCIM'].map(b => (
                <span key={b} className="landing-security__badge-item">{b}</span>
              ))}
            </div>
          </div>
          <div className="landing-security__visual">
            <Shield size={120} color="rgba(255,255,255,0.15)" strokeWidth={1} />
            <div className="landing-security__shield-check">
              <Shield size={48} color="white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </section>


      {/* ════════ FINAL CTA ════════ */}
      <section className="landing-section">
        <div ref={ctaRef} className={`landing-cta ${ctaVisible ? 'landing-visible' : ''}`}>
          <h2 className="landing-cta__title">Get started in seconds — for free.</h2>
          <p className="landing-cta__desc">Join millions of professionals who trust Calendly for effortless scheduling.</p>
          <div className="landing-cta__actions">
            <Link href="/login" className="landing-btn landing-btn--primary landing-btn--lg" id="cta-signup">
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* ════════ FOOTER ════════ */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <Link href="/" className="landing-nav__logo">
              <div className="landing-nav__logo-icon">
                <Calendar size={22} color="white" strokeWidth={2.5} />
              </div>
              <span className="landing-nav__logo-text" style={{ color: 'white' }}>Calendly</span>
            </Link>
            <p className="landing-footer__tagline">Easy scheduling ahead</p>
          </div>

          <div className="landing-footer__grid">
            {[
              {
                title: 'Product',
                links: ['Scheduling', 'Event Types', 'Availability', 'Integrations', 'Mobile App'],
              },
              {
                title: 'Solutions',
                links: ['For Individuals', 'Small Business', 'Enterprise', 'Sales', 'Recruiting'],
              },
              {
                title: 'Resources',
                links: ['Help Center', 'Blog', 'Developer Docs', 'Community', 'Release Notes'],
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Security', 'Privacy', 'Terms'],
              },
            ].map(col => (
              <div key={col.title} className="landing-footer__col">
                <h4 className="landing-footer__heading">{col.title}</h4>
                {col.links.map(link => (
                  <a key={link} href="#" className="landing-footer__link">{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="landing-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Calendly Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
