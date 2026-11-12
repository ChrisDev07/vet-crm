'use client';

import Link from 'next/link';
import { useAuthSession } from '@/lib/auth';

export default function Home() {
  const { session } = useAuthSession();
  const userEmail = session?.user?.email;

  return (
    <div className="w-full pt-24 px-4 sm:px-space-lg pb-space-xl bg-background min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="bg-surface-container-low/70 backdrop-blur-md p-6 sm:p-12 rounded-3xl border border-white shadow-xl text-center max-w-2xl w-full">
        <span className="material-symbols-outlined text-[56px] sm:text-[64px] text-primary mb-4">waving_hand</span>
        {userEmail && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Sesión activa: {userEmail}
            </span>
          </div>
        )}
        <h1 className="font-display-lg text-headline-xl sm:text-display-lg text-on-surface mb-4">
          Recepción <span className="text-primary">MEDIVET</span>
        </h1>
        <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant mb-8">
          CRM Clínico de oportunidades de atención veterinaria conectado de forma segura a Supabase.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/registro" className="group p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low hover:-translate-y-1 transition-all flex items-start gap-3 text-left border border-transparent hover:border-tertiary/20">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">assignment_add</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface group-hover:text-tertiary transition-colors">Atención Rápida</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Registra nuevos prospectos en menos de 1 minuto.</p>
            </div>
          </Link>
          <Link href="/gestion" className="group p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low hover:-translate-y-1 transition-all flex items-start gap-3 text-left border border-transparent hover:border-primary/20">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Gestión y Casos</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Llamadas de hoy, seguimiento y cambios de estado.</p>
            </div>
          </Link>
          <Link href="/dashboard" className="group p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low hover:-translate-y-1 transition-all flex items-start gap-3 text-left border border-transparent hover:border-secondary/20">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors">Tablero de Métricas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">7 KPIs automáticos para el informe de grado.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
