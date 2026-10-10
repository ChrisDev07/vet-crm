'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('medivet_shift');
    router.push('/login');
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return "group flex items-center px-space-md py-space-sm rounded-lg transition-all bg-surface-container-low text-primary font-bold shadow-sm border-l-4 border-primary";
    }
    return "group flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all border-l-4 border-transparent";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="h-20 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">pets</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary leading-tight">MEDIVET</span>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">CRM Clínico</span>
          </div>
        </div>
        <div className="px-space-md py-space-sm">
          <nav className="flex flex-col gap-space-xs">
            <Link className={getLinkClass('/')} href="/">
              <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">home</span>
              <span className="font-label-lg text-label-lg">Inicio</span>
            </Link>
            <Link className={getLinkClass('/registro')} href="/registro">
              <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">assignment_add</span>
              <span className="font-label-lg text-label-lg flex-1">Registrar Oportunidad</span>
            </Link>
            <Link className={getLinkClass('/gestion')} href="/gestion">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">group</span>
                <span className="font-label-lg text-label-lg">Gestión y Seguimiento</span>
              </div>
            </Link>
            <Link className={getLinkClass('/dashboard')} href="/dashboard">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">monitoring</span>
                <span className="font-label-lg text-label-lg">Tablero de Métricas</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
      <div className="p-space-md m-space-md rounded-xl bg-surface-container-low">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb_mYamWggeqQFXxmAyWjbQdCX5xCMYHaPLkzHJ6v6eQzDcjAmcCn5qnIRAhYn1owc803bBoVrELhlRskm3KGtmVl9k1EgFFSTWBj0876U0gv4HwL9s4Tv1iom11cDi0DOaxpVsoNw4NtLZ_tApsvLyRJ5f2IUB29Tbqq3rPwfqqfVgNTzlSojDGyeZuzLeuKB4lUCaqw0cxSEN0LNvKqMITZ8nR02ujCgmwrpkctxi_F5fen-lZ5McA"/>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">María K.</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Recepción</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-all flex items-center justify-center" title="Cambiar turno / Cerrar sesión" type="button">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
