'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buscarPacientesYOportunidades, obtenerOportunidades, ResultadoBusqueda } from '@/lib/db';

interface Notificacion {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  petName?: string;
}

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadNotifications() {
      const oportunidades = await obtenerOportunidades();
      if (cancelled) return;

      const todayStr = new Date().toLocaleDateString('en-CA');
      const pendientes = oportunidades.filter(
        (o) =>
          (o.estado === 'Pendiente' || o.estado === 'En Gestión') &&
          (o.fecha_propuesta_seguimiento === todayStr || o.estado === 'Pendiente')
      );

      const items: Notificacion[] = pendientes.slice(0, 6).map((o) => ({
        id: o.id,
        title: o.fecha_propuesta_seguimiento === todayStr ? 'Llamada de Hoy' : 'Caso Pendiente',
        message: `Contactar a ${o.pacientes?.nombre_tutor || 'Tutor'} (paciente ${o.pacientes?.nombre_paciente || 'Mascota'}) — ${o.servicio_interes}`,
        time: o.fecha_propuesta_seguimiento === todayStr ? 'Hoy' : (o.fecha_propuesta_seguimiento || 'Sin fecha'),
        unread: true,
        petName: o.pacientes?.nombre_paciente,
      }));
      setNotifications(items);
    }
    void loadNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResultadoBusqueda[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const trimmedQuery = searchQuery.trim();

  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await buscarPacientesYOportunidades(trimmedQuery);
      if (!cancelled) {
        setSearchResults(results);
        setIsSearching(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  const visibleResults = trimmedQuery ? searchResults : [];

  const handleSelectResult = (result: ResultadoBusqueda) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/gestion?q=${encodeURIComponent(result.nombre_paciente)}`);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-30 px-4 sm:px-space-lg flex items-center justify-between gap-3">
      {/* LEFT: Mobile Menu Trigger + Search + Status */}
      <div className="flex items-center gap-3 sm:gap-space-md flex-1 max-w-xl min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shrink-0"
          aria-label="Abrir menú de navegación"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div ref={searchRef} className="relative w-full max-w-md z-40">
          <span className="material-symbols-outlined absolute left-3 top-1/2 pointer-events-none -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            ref={inputRef}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-inner"
            placeholder="Buscar tutor o paciente... (Ctrl+K)"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchQuery(nextValue);
              if (nextValue.trim() === '') {
                setSearchResults([]);
                setIsSearching(false);
              }
            }}
            onFocus={() => setIsSearchFocused(true)}
          />

          {/* Spotlight Dropdown */}
          {isSearchFocused && trimmedQuery !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-low overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-surface-container-low/50 bg-surface-container-low/30 flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline px-2">Resultados rápidos</span>
                <span className="font-label-sm text-label-sm text-primary px-2">
                  {isSearching ? 'Buscando...' : `${visibleResults.length} encontrados`}
                </span>
              </div>
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {visibleResults.length > 0 ? (
                  visibleResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className="flex items-center gap-3 p-3 hover:bg-surface-container-low/50 transition-colors text-left border-b border-surface-container-low/30 last:border-0 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{result.especie === 'Canino' ? 'pets' : 'cruelty_free'}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-md text-label-md text-on-surface font-bold truncate">{result.nombre_paciente}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">{result.especie}</span>
                          {result.estado && (
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-label-sm text-[10px] font-semibold">{result.estado}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-body-sm text-body-sm text-on-surface-variant truncate"><span className="material-symbols-outlined text-[13px] align-text-bottom mr-0.5">person</span>{result.nombre_tutor}</span>
                          <span className="font-body-sm text-[11px] text-outline truncate">• {result.telefono}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">chevron_right</span>
                    </button>
                  ))
                ) : !isSearching ? (
                  <div className="p-8 text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-outline/50">search_off</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">No se encontraron pacientes para &ldquo;{searchQuery}&rdquo;</p>
                    <Link href="/registro" onClick={() => setIsSearchFocused(false)} className="mt-2 px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-label-sm text-label-sm hover:bg-primary/20 transition-colors">
                      + Registrar nuevo prospecto
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant shrink-0">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>Recepción Activa</span>
        </div>
      </div>

      {/* RIGHT: Notifications */}
      <div className="flex items-center gap-4 relative shrink-0">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-full transition-colors ${showNotifications ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            type="button"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-low overflow-hidden z-40 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-4 border-b border-surface-container-low bg-surface-container/30">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-primary font-label-sm text-label-sm hover:underline" type="button">
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="flex flex-col max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notif.petName) {
                        router.push(`/gestion?q=${encodeURIComponent(notif.petName)}`);
                      } else {
                        router.push('/gestion');
                      }
                    }}
                    className={`p-4 border-b border-surface-container-low/50 hover:bg-surface-container-low/50 transition-colors cursor-pointer ${notif.unread ? 'bg-primary-fixed/10' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{notif.title}</span>
                      <span className="font-label-sm text-label-sm text-outline whitespace-nowrap text-[11px]">{notif.time}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-tight">{notif.message}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-6 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl opacity-50 mb-2">notifications_paused</span>
                    <p className="font-body-sm text-body-sm">No tienes notificaciones</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
