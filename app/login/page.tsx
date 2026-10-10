'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSelectShift = (shift: 'mañana' | 'tarde') => {
    localStorage.setItem('medivet_shift', shift);
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-10">
        
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[36px]">pets</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight mb-2">¡Hola, Equipo MEDIVET!</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Bienvenido al CRM Clínico. Para comenzar, por favor selecciona el turno en el que estás ingresando.
            </p>
          </div>
        </div>

        {/* Shift Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          
          {/* Turno Mañana */}
          <button 
            onClick={() => handleSelectShift('mañana')}
            className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-surface-container-lowest border-2 border-transparent hover:border-primary/30 hover:bg-surface-container-low hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/30 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[40px]">wb_sunny</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Turno Mañana</h2>
                <span className="font-label-md text-label-md text-outline">08:00 AM - 02:00 PM</span>
              </div>
            </div>
          </button>

          {/* Turno Tarde */}
          <button 
            onClick={() => handleSelectShift('tarde')}
            className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-surface-container-lowest border-2 border-transparent hover:border-secondary/30 hover:bg-surface-container-low hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed/30 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[40px]">mode_night</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Turno Tarde</h2>
                <span className="font-label-md text-label-md text-outline">02:00 PM - 08:00 PM</span>
              </div>
            </div>
          </button>

        </div>

        {/* Footer info */}
        <p className="font-label-sm text-label-sm text-outline mt-8 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          Acceso exclusivo para personal autorizado
        </p>
      </div>
    </main>
  );
}
