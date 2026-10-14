'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Opportunity {
  id: number;
  tutor: string;
  pet: string;
  species: 'Canino' | 'Felino' | 'Exótico';
  age: string;
  phone: string;
  service: string;
  opportunityType: string;
  notes: string;
  proposedDate: string;
  isToday: boolean;
  status: 'Pendiente' | 'En Proceso' | 'Cita Agendada' | 'Consulta Concretada' | 'Rechazado';
}

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    tutor: 'Juan Pérez',
    pet: 'Firulais',
    species: 'Canino',
    age: '3a',
    phone: '300 123 4567',
    service: 'Medicina General',
    opportunityType: 'Cita no concretada',
    notes: 'Por costo de consulta inicial. Interesado en paquete preventivo.',
    proposedDate: 'Hoy - 16:00 hrs',
    isToday: true,
    status: 'Pendiente'
  },
  {
    id: 2,
    tutor: 'Mariana Palacios',
    pet: 'Misi',
    species: 'Felino',
    age: '5a',
    phone: '312 984 2190',
    service: 'Medicina Interna',
    opportunityType: 'Inasistencia a control',
    notes: 'Paciente presentó mejoría temporal, tutor quiere reevaluar examen coprológico.',
    proposedDate: '14/Oct/2026',
    isToday: false,
    status: 'En Proceso'
  },
  {
    id: 3,
    tutor: 'Carlos Méndez',
    pet: 'Rocky',
    species: 'Canino',
    age: '1a',
    phone: '315 432 9876',
    service: 'Vacunación & Desp.',
    opportunityType: 'Seguimiento anual',
    notes: 'Tutor solicitó recordatorio por WhatsApp un día antes del horario matutino.',
    proposedDate: '15/Oct/2026',
    isToday: false,
    status: 'Cita Agendada'
  },
  {
    id: 4,
    tutor: 'Camila Restrepo',
    pet: 'Luna',
    species: 'Felino',
    age: '4a',
    phone: '315 776 5432',
    service: 'Odontología Profilaxis',
    opportunityType: 'Presupuesto enviado',
    notes: 'Consulta financiamiento en cuotas sin interés para profilaxis dental grado 2.',
    proposedDate: '16/Oct/2026',
    isToday: false,
    status: 'Pendiente'
  },
  {
    id: 5,
    tutor: 'Roberto Luna',
    pet: 'Balto',
    species: 'Canino',
    age: '7a',
    phone: '301 555 4321',
    service: 'Cirugía Menor',
    opportunityType: 'Evaluación prequirúrgica',
    notes: 'Confirmó cita con Dr. Valenzuela para anestesiología y hemograma.',
    proposedDate: '14/Oct/2026',
    isToday: false,
    status: 'Consulta Concretada'
  },
  {
    id: 6,
    tutor: 'Andrea Gómez',
    pet: 'Kira',
    species: 'Canino',
    age: '2a',
    phone: '318 223 9911',
    service: 'Medicina General',
    opportunityType: 'Derivación externa',
    notes: 'Decidió atenderse en clínica de su barrio por cercanía geográfica.',
    proposedDate: '12/Oct/2026',
    isToday: false,
    status: 'Rechazado'
  }
];

export default function GestionPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [activeStatusTab, setActiveStatusTab] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'todos' | 'hoy' | 'semana'>('todos');
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<Opportunity | null>(null);
  const [modalNewStatus, setModalNewStatus] = useState<Opportunity['status']>('Pendiente');
  const [modalNote, setModalNote] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  // Status counts
  const counts = useMemo(() => {
    return {
      todos: opportunities.length,
      pendientes: opportunities.filter(o => o.status === 'Pendiente').length,
      enProceso: opportunities.filter(o => o.status === 'En Proceso').length,
      citas: opportunities.filter(o => o.status === 'Cita Agendada').length,
      concretadas: opportunities.filter(o => o.status === 'Consulta Concretada').length,
      rechazados: opportunities.filter(o => o.status === 'Rechazado').length,
    };
  }, [opportunities]);

  // Filtered list
  const filteredList = useMemo(() => {
    return opportunities.filter(item => {
      // Status filter
      if (activeStatusTab === 'pendientes' && item.status !== 'Pendiente') return false;
      if (activeStatusTab === 'en_proceso' && item.status !== 'En Proceso') return false;
      if (activeStatusTab === 'citas' && item.status !== 'Cita Agendada') return false;
      if (activeStatusTab === 'concretadas' && item.status !== 'Consulta Concretada') return false;
      if (activeStatusTab === 'rechazados' && item.status !== 'Rechazado') return false;

      // Date filter
      if (dateFilter === 'hoy' && !item.isToday) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTutor = item.tutor.toLowerCase().includes(query);
        const matchesPet = item.pet.toLowerCase().includes(query);
        const matchesPhone = item.phone.includes(query);
        const matchesService = item.service.toLowerCase().includes(query);
        if (!matchesTutor && !matchesPet && !matchesPhone && !matchesService) return false;
      }

      return true;
    });
  }, [opportunities, activeStatusTab, dateFilter, searchQuery]);

  // Handle Quick Status Change
  const handleQuickStatusChange = (id: number, newStatus: Opportunity['status']) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`✅ Caso actualizado a "${newStatus}"`);
  };

  // Open Modal for Detailed Management
  const openManageModal = (item: Opportunity) => {
    setSelectedCaseForModal(item);
    setModalNewStatus(item.status);
    setModalNote('');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForModal) return;

    setOpportunities(prev => prev.map(o => {
      if (o.id === selectedCaseForModal.id) {
        return {
          ...o,
          status: modalNewStatus,
          notes: modalNote.trim() !== '' ? `${modalNote} (${o.notes})` : o.notes
        };
      }
      return o;
    }));

    showToast(`✅ Gestión guardada para ${selectedCaseForModal.pet} (${modalNewStatus})`);
    setSelectedCaseForModal(null);
  };

  // Open WhatsApp
  const handleWhatsApp = (item: Opportunity) => {
    const cleanPhone = item.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${item.tutor}, te saludamos de MEDIVET respecto a tu mascota ${item.pet}. Quisiéramos saber cómo se encuentra y coordinar su seguimiento.`);
    const url = `https://wa.me/57${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
    showToast(`💬 Abriendo WhatsApp para ${item.tutor}`);
  };

  // Export to CSV (RF-04)
  const handleExportCSV = () => {
    const headers = ['ID', 'Tutor', 'Mascota', 'Especie', 'Edad', 'Telefono', 'Servicio', 'Tipo_Oportunidad', 'Motivo_Notas', 'Fecha_Propuesta', 'Estado'];
    const rows = opportunities.map(o => [
      o.id,
      `"${o.tutor}"`,
      `"${o.pet}"`,
      `"${o.species}"`,
      `"${o.age}"`,
      `"${o.phone}"`,
      `"${o.service}"`,
      `"${o.opportunityType}"`,
      `"${o.notes.replace(/"/g, '""')}"`,
      `"${o.proposedDate}"`,
      `"${o.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `oportunidades_medivet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Reporte CSV descargado con éxito');
  };

  return (
    <main className="w-full pt-20 px-space-lg pb-space-xl bg-background min-h-screen">
      <div className="flex flex-col w-full">
        
        {/* Breadcrumbs & Quick Header Section */}
        <div className="flex flex-col gap-space-sm mb-space-md">
          <nav aria-label="Ruta de navegación" class="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Inicio</span>
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-outline">Oportunidades</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Gestión y Seguimiento</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Gestión y Seguimiento</h1>
                <span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                  En Vivo
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Administra y realiza el seguimiento activo de oportunidades, citas no concretadas y retención de pacientes.
              </p>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-space-sm self-start lg:self-center flex-wrap">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-low hover:shadow transition-all border border-transparent hover:border-primary/20" 
                type="button"
                title="Exportar base de datos a CSV / Excel (RF-04)"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">file_download</span>
                <span>Descargar Reporte (CSV)</span>
              </button>

              <Link 
                href="/registro"
                className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md hover:brightness-105 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Nueva Oportunidad</span>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI / Performance Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
          {/* KPI 1: Urgent Pending Cases */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-transparent hover:border-error/20 transition-all">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Pendientes</span>
              </div>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-error bg-error-container/50 px-2 py-0.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                Prioritarios
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">{counts.pendientes}</span>
                <span className="font-body-sm text-body-sm text-outline">casos activos</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Recepción</span>
            </div>
          </div>

          {/* KPI 2: Converted Appointments */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-transparent hover:border-tertiary/20 transition-all">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Citas Agendadas</span>
              </div>
              <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-tertiary font-bold bg-surface-container-low px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                En agenda
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">{counts.citas}</span>
                <span className="font-body-sm text-body-sm text-outline">confirmadas</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">Activas</span>
            </div>
          </div>

          {/* KPI 3: Consultas Concretadas */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-transparent hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Concretadas</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">Meta 70%</span>
            </div>
            <div className="flex flex-col gap-space-xs mt-space-xs">
              <div className="flex items-baseline justify-between">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">{counts.concretadas}</span>
                <span className="font-label-sm text-label-sm text-outline">
                  {counts.todos > 0 ? ((counts.concretadas / counts.todos) * 100).toFixed(1) : 0}% efectividad
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-700" 
                  style={{ width: `${counts.todos > 0 ? (counts.concretadas / counts.todos) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPI 4: Tiempo de Respuesta */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-transparent hover:border-secondary/20 transition-all">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tiempo Respuesta</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full font-medium">WhatsApp</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">38</span>
                <span className="font-headline-md text-headline-md text-outline">min</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary flex items-center font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                Óptimo
              </span>
            </div>
          </div>
        </div>

        {/* Filters, Tabs & Main Interactive Table Section */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm flex flex-col gap-space-md">
          
          {/* Filter Bar Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 max-w-full">
              <button 
                onClick={() => setActiveStatusTab('todos')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'todos' 
                    ? 'bg-primary text-on-primary font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>Todos</span>
                <span className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${
                  activeStatusTab === 'todos' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {counts.todos}
                </span>
              </button>

              <button 
                onClick={() => setActiveStatusTab('pendientes')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'pendientes' 
                    ? 'bg-error-container text-on-error-container font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>Pendientes</span>
                <span className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${
                  activeStatusTab === 'pendientes' ? 'bg-error text-on-error' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {counts.pendientes}
                </span>
              </button>

              <button 
                onClick={() => setActiveStatusTab('en_proceso')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'en_proceso' 
                    ? 'bg-secondary-fixed text-on-secondary-fixed font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>En Proceso</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-[11px] text-on-surface-variant font-bold">
                  {counts.enProceso}
                </span>
              </button>

              <button 
                onClick={() => setActiveStatusTab('citas')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'citas' 
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>Citas Agendadas</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-[11px] text-on-surface-variant font-bold">
                  {counts.citas}
                </span>
              </button>

              <button 
                onClick={() => setActiveStatusTab('concretadas')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'concretadas' 
                    ? 'bg-primary-fixed text-primary font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>Concretadas</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-[11px] text-on-surface-variant font-bold">
                  {counts.concretadas}
                </span>
              </button>

              <button 
                onClick={() => setActiveStatusTab('rechazados')}
                className={`px-space-md py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-space-xs ${
                  activeStatusTab === 'rechazados' 
                    ? 'bg-surface-container-highest text-on-surface font-bold shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`} 
                type="button"
              >
                <span>Rechazados</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-[11px] text-on-surface-variant font-bold">
                  {counts.rechazados}
                </span>
              </button>
            </div>

            {/* Search & Date Filter */}
            <div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                <input 
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-inner" 
                  placeholder="Buscar tutor, mascota o teléfono..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none pr-8"
                >
                  <option value="todos">Todos los periodos</option>
                  <option value="hoy">📅 Solo llamadas de Hoy</option>
                  <option value="semana">Próximos 7 días</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">
                  keyboard_arrow_down
                </span>
              </div>
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto -mx-space-lg px-space-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 rounded-xl">
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold first:rounded-l-xl">Tutor y Paciente</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Contacto</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Servicio / Oportunidad</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Motivo / Notas de Interacción</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">F. Propuesta</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Estado</th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold text-right last:rounded-r-xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low/40">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors group">
                    
                    {/* Columna 1: Tutor y Paciente */}
                    <td className="py-space-md px-space-md align-middle">
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-surface-container-high/60 flex items-center justify-center text-[20px] shrink-0 shadow-sm" title={item.species}>
                          {item.species === 'Canino' ? '🐶' : item.species === 'Felino' ? '🐱' : '🦜'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-lg text-label-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                            {item.tutor}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                              {item.pet}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                            <span className="font-body-sm text-body-sm text-outline text-[11px]">
                              {item.species} • {item.age}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Columna 2: Contacto & WhatsApp */}
                    <td className="py-space-md px-space-md align-middle whitespace-nowrap">
                      <div className="flex items-center gap-space-xs">
                        <a 
                          className="font-body-sm text-body-sm text-on-surface hover:text-primary font-medium tracking-tight" 
                          href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        >
                          {item.phone}
                        </a>
                        <button 
                          onClick={() => handleWhatsApp(item)}
                          className="p-1.5 rounded-lg hover:bg-tertiary-fixed/30 text-tertiary transition-colors" 
                          title="Contactar por WhatsApp con plantilla" 
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                        </button>
                      </div>
                    </td>

                    {/* Columna 3: Servicio & Oportunidad */}
                    <td className="py-space-md px-space-md align-middle">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                          {item.service}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline text-[11px]">
                          {item.opportunityType}
                        </span>
                      </div>
                    </td>

                    {/* Columna 4: Motivo / Notas */}
                    <td className="py-space-md px-space-md align-middle max-w-xs">
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2" title={item.notes}>
                        {item.notes}
                      </p>
                    </td>

                    {/* Columna 5: Fecha propuesta */}
                    <td className="py-space-md px-space-md align-middle whitespace-nowrap">
                      {item.isToday ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-container/40 text-on-error-container font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[14px]">alarm</span>
                          <span>{item.proposedDate}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                          <span className="material-symbols-outlined text-[14px] text-outline">calendar_today</span>
                          <span>{item.proposedDate}</span>
                        </div>
                      )}
                    </td>

                    {/* Columna 6: Estado (Interactuable) */}
                    <td className="py-space-md px-space-md align-middle whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleQuickStatusChange(item.id, e.target.value as Opportunity['status'])}
                        className={`text-label-sm font-semibold rounded-full px-3 py-1 cursor-pointer transition-all border-0 focus:outline-none focus:ring-2 focus:ring-primary ${
                          item.status === 'Pendiente' ? 'bg-error-container/60 text-on-error-container' :
                          item.status === 'En Proceso' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                          item.status === 'Cita Agendada' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                          item.status === 'Consulta Concretada' ? 'bg-primary-fixed text-primary' :
                          'bg-surface-container-highest text-outline'
                        }`}
                      >
                        <option value="Pendiente">🟡 Pendiente</option>
                        <option value="En Proceso">🔵 En Proceso</option>
                        <option value="Cita Agendada">🟣 Cita Agendada</option>
                        <option value="Consulta Concretada">🟢 Consulta Concretada</option>
                        <option value="Rechazado">🔴 Rechazado</option>
                      </select>
                    </td>

                    {/* Columna 7: Acciones */}
                    <td className="py-space-md px-space-md align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-space-xs">
                        <button 
                          onClick={() => openManageModal(item)}
                          className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-1" 
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit_note</span>
                          <span>+ Gestionar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-outline/50">search_off</span>
                        <p className="font-label-lg font-bold">No se encontraron casos con los filtros seleccionados</p>
                        <button 
                          onClick={() => { setActiveStatusTab('todos'); setSearchQuery(''); setDateFilter('todos'); }}
                          className="text-primary font-label-sm hover:underline mt-1"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-sm mt-space-xs border-t border-surface-container-low">
            <div className="flex items-center gap-space-md">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Mostrando <strong className="text-on-surface font-semibold">{filteredList.length}</strong> de <strong className="text-on-surface font-semibold">{opportunities.length}</strong> seguimientos
              </span>
            </div>
            <div className="flex items-center gap-space-xs self-center">
              <button className="w-8 h-8 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm flex items-center justify-center" type="button">
                1
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: Gestionar Caso Clínico */}
      {selectedCaseForModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 flex flex-col gap-5 border border-surface-container">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Gestionar Seguimiento</h3>
                  <span className="font-body-sm text-[12px] text-outline">
                    {selectedCaseForModal.pet} ({selectedCaseForModal.species}) • Tutor: {selectedCaseForModal.tutor}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCaseForModal(null)}
                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col gap-4">
              
              {/* Cambiar Estado */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Nuevo Estado de la Oportunidad
                </label>
                <select 
                  value={modalNewStatus}
                  onChange={(e) => setModalNewStatus(e.target.value as Opportunity['status'])}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                >
                  <option value="Pendiente">🟡 Pendiente (Requiere nuevo contacto)</option>
                  <option value="En Proceso">🔵 En Proceso (Conversación iniciada)</option>
                  <option value="Cita Agendada">🟣 Cita Agendada (Cupo reservado)</option>
                  <option value="Consulta Concretada">🟢 Consulta Concretada (Paciente asistió)</option>
                  <option value="Rechazado">🔴 Rechazado (No interesado / Otra clínica)</option>
                </select>
              </div>

              {/* Nueva Nota de Llamada / Contacto */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Resultado de la llamada o mensaje
                </label>
                <textarea 
                  rows={3}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="Ej: Se habló con el tutor, acepta promoción de vacuna el día jueves a las 10:00 AM..."
                  className="w-full p-3 rounded-xl bg-surface-container-low font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none"
                ></textarea>
              </div>

              {/* Botón de WhatsApp rápido desde el modal */}
              <button
                type="button"
                onClick={() => handleWhatsApp(selectedCaseForModal)}
                className="w-full py-2.5 rounded-xl bg-tertiary-fixed/30 text-tertiary hover:bg-tertiary hover:text-on-tertiary font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Abrir WhatsApp con {selectedCaseForModal.tutor}</span>
              </button>

              {/* Botones de acción del Modal */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForModal(null)}
                  className="px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:bg-primary-container transition-all"
                >
                  Guardar Gestión
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Toast Notification element */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} id="toast-notification">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl">
          <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMsg}</span>
        </div>
      </div>

    </main>
  );
}
