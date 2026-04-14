import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Calendly Clone — Scheduling made simple',
  description: 'A production-ready scheduling platform for managing meetings, availability, and bookings.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-secondary)]">
        <div className="flex min-h-screen">
          <Sidebar />
          {/* pt-[60px] on mobile to account for the fixed top bar, md:pt-0 on desktop */}
          <main className="flex-1 min-h-screen overflow-y-auto pt-[60px] md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
