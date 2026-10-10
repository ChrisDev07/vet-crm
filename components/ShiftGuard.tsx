'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShiftGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const shift = localStorage.getItem('medivet_shift');
    if (!shift) {
      router.push('/login');
    } else {
      setIsReady(true);
    }
  }, [router]);

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
