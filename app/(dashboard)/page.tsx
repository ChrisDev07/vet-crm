import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full pt-20 px-space-lg pb-space-xl bg-background min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="bg-surface-container-low/70 backdrop-blur-md p-12 rounded-3xl border border-white shadow-xl text-center max-w-2xl">
        <span className="material-symbols-outlined text-[64px] text-primary mb-6 animate-bounce">waving_hand</span>
        <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
          ¡Hola, <span className="text-primary">María</span>!
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Bienvenida al nuevo CRM Clínico de MEDIVET. Utiliza el menú lateral para navegar entre las diferentes herramientas.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/registro" className="group p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low hover:-translate-y-1 transition-all flex items-start gap-3 text-left border border-transparent hover:border-tertiary/20">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">assignment_add</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface group-hover:text-tertiary transition-colors">Atención Rápida</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Registra nuevos prospectos en segundos.</p>
            </div>
          </Link>
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-3 text-left opacity-70">
            <span className="material-symbols-outlined text-secondary">monitoring</span>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">Métricas de hoy</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Sección en construcción.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
