'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, session, isRecovery } = useAuthSession();

  useEffect(() => {
    if (!loading && isRecovery) {
      router.replace('/restablecer-clave');
      return;
    }
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, session, isRecovery, router]);

  if (loading || !session || isRecovery) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Verificando sesión...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
