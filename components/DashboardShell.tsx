'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useAuthSession } from '@/lib/auth';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { session } = useAuthSession();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isChangePasswordOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChangePasswordOpen]);

  return (
    <AuthGuard>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangePasswordClick={() => {
          setIsSidebarOpen(false);
          setIsChangePasswordOpen(true);
        }}
      />
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
      {isChangePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordOpen(false)}
          userEmail={session?.user?.email}
        />
      )}
    </AuthGuard>
  );
}
