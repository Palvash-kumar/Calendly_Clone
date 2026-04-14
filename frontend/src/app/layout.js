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
          <main className="flex-1 min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
