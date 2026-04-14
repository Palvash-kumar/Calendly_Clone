'use client';

/**
 * Page header component with title, subtitle, and optional action button.
 */
export default function Header({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] m-0">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] mt-1 m-0">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
