'use client';

import { useState, useEffect } from 'react';
import ShiftGuard from '@/components/ShiftGuard';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ShiftGuard>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="lg:pl-72 min-h-screen transition-[padding] duration-300">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </div>
    </ShiftGuard>
  );
}
