'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveShift } from '@/lib/shift';

export default function ShiftGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const shift = useActiveShift();

  useEffect(() => {
    if (shift === null) {
      router.push('/login');
    }
  }, [router, shift]);

  const isReady = shift === 'mañana' || shift === 'tarde';

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {children}
    </>
  );
}
