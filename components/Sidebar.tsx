'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOutUser, useAuthSession } from '@/lib/auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onChangePasswordClick?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, onChangePasswordClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useAuthSession();
  const userEmail = session?.user?.email || 'Usuario autenticado';

  const handleLogout = async () => {
    await signOutUser();
    onClose?.();
    router.replace('/login');
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return 'group flex items-center px-space-md py-space-sm rounded-lg transition-all bg-surface-container-low text-primary font-bold shadow-sm border-l-4 border-primary';
    }
    return 'group flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all border-l-4 border-transparent';
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.06)] z-50 lg:z-30 flex flex-col justify-between transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col">
        <div className="h-20 px-space-lg flex items-center justify-between gap-space-sm bg-surface-container-lowest">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">pets</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary leading-tight">MEDIVET</span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">CRM Clínico</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            aria-label="Cerrar menú lateral"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="px-space-md py-space-sm">
          <nav className="flex flex-col gap-space-xs">
            <Link className={getLinkClass('/')} href="/" onClick={() => onClose?.()}>
              <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">home</span>
              <span className="font-label-lg text-label-lg">Inicio</span>
            </Link>
            <Link className={getLinkClass('/registro')} href="/registro" onClick={() => onClose?.()}>
              <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">assignment_add</span>
              <span className="font-label-lg text-label-lg flex-1">Registrar Oportunidad</span>
            </Link>
            <Link className={getLinkClass('/gestion')} href="/gestion" onClick={() => onClose?.()}>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[20px] mr-space-sm text-outline group-hover:text-primary transition-colors">group</span>
                <span className="font-label-lg text-label-lg">Gestión y Seguimiento</span>
              </div>
            </Link>
            <Link className={getLinkClass('/dashboard')} href="/dashboard" onClick={() => onClose?.()}>
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
            <div className="w-9 h-9 rounded-full bg-primary/12 text-primary ring-2 ring-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">verified_user</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Recepción MEDIVET</span>
              <span className="font-body-sm text-body-sm text-primary font-medium truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-all flex items-center justify-center shrink-0"
            title="Cerrar sesión"
            type="button"
            aria-label="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
        {onChangePasswordClick && (
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="mt-2.5 pt-2.5 border-t border-surface-container w-full flex items-center justify-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-1 rounded-lg hover:bg-surface-container-lowest/70"
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            <span>Cambiar contraseña</span>
          </button>
        )}
      </div>
    </aside>
  );
}
