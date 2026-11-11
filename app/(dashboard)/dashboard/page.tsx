'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerMetricasDashboard, MetricasDashboard } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [syncTime, setSyncTime] = useState('Hoy a las 11:45 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('este_mes');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  const [metrics, setMetrics] = useState<MetricasDashboard>({
    total_identificadas: 124,
    total_gestionadas: 89,
    citas_generadas: 42,
    consultas_concretadas: 28,
    pacientes_recuperados: 18,
    consultas_general: 16,
    consultas_interna: 12,
    pendientes: 35,
    en_gestion: 0,
    rechazados: 19,
  });

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const dbData = await obtenerMetricasDashboard();
        setMetrics(dbData);
        setIsLiveFromDb(true);
      } catch (err) {
        console.error('Error al cargar métricas de Supabase:', err);
      }
    }
  };

  useEffect(() => {
    const now = new Date();
    setSyncTime(`Hoy a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    const now = new Date();
    setSyncTime(`Hoy a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    showToast(isSupabaseConfigured() ? '🔄 Métricas sincronizadas con Supabase (PostgreSQL)' : '🔄 Métricas actualizadas (Modo Demo)');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const headers = ['Indicador_Clave', 'Valor', 'Detalle_Clinico', 'Meta'];
    const rows = [
      ['1. Oportunidades Identificadas', metrics.total_identificadas.toString(), 'Total de casos capturados en recepción', 'N/A'],
      ['2. Oportunidades Gestionadas', metrics.total_gestionadas.toString(), `${((metrics.total_gestionadas / (metrics.total_identificadas || 1)) * 100).toFixed(1)}% de tasa de contacto activo`, '70%'],
      ['3. Citas Generadas', metrics.citas_generadas.toString(), `${((metrics.citas_generadas / (metrics.total_identificadas || 1)) * 100).toFixed(1)}% de conversión a agenda`, '30%'],
      ['4. Consultas Concretadas', metrics.consultas_concretadas.toString(), 'Pacientes que asistieron a consulta médica', '25%'],
      ['5. Pacientes Recuperados', metrics.pacientes_recuperados.toString(), 'Recuperados tras inasistencia o cancelación', '15'],
      ['6. Consultas Medicina General', metrics.consultas_general.toString(), 'Consultas de medicina general cerradas', 'N/A'],
      ['7. Consultas Medicina Interna', metrics.consultas_interna.toString(), 'Consultas de medicina interna / derivaciones', 'N/A'],
    ];

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medivet_metricas_grado_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Reporte de métricas exportado a Excel (CSV)');
  };

  const totalConsultas = metrics.consultas_concretadas || 0;
  const pctGeneral = totalConsultas > 0 ? (metrics.consultas_general / totalConsultas) * 100 : 0;
  const pctInterna = totalConsultas > 0 ? (metrics.consultas_interna / totalConsultas) * 100 : 0;
  const circumference = 389.56;
  const dashGeneral = (pctGeneral / 100) * circumference;
  const dashInterna = (pctInterna / 100) * circumference;

  const totalBase = metrics.total_identificadas || 1;
  const pctPendientes = ((metrics.pendientes / totalBase) * 100).toFixed(1);
  const pctEnGestion = ((metrics.en_gestion / totalBase) * 100).toFixed(1);
  const pctCitas = ((metrics.citas_generadas / totalBase) * 100).toFixed(1);
  const pctConcretadas = ((metrics.consultas_concretadas / totalBase) * 100).toFixed(1);
  const pctRechazados = ((metrics.rechazados / totalBase) * 100).toFixed(1);

  return (
    <main className="relative pt-20 bg-surface min-h-screen px-gutter py-space-md">
      <div className="flex flex-col w-full">
        
        {/* Dynamic Atmospheric Glow */}
        <div className="relative w-full overflow-hidden pb-space-lg">
          <div className="absolute -top-16 -left-12 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Navigation / Breadcrumb & Title Bar */}
          <div className="relative flex flex-col gap-space-sm mb-space-md">
            
            {/* Breadcrumb Bar */}
            <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Inicio</span>
              </Link>
              <span className="text-outline-variant font-bold">/</span>
              <span className="text-outline">Oportunidades</span>
              <span className="text-outline-variant font-bold">/</span>
              <span className="text-primary font-semibold">Tablero de Métricas</span>
            </nav>

            {/* Main Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                    Tablero de <span className="text-primary">Métricas Clínicas</span>
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    {isLiveFromDb ? 'Supabase en Tiempo Real' : 'Modo Demo Local'}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Monitorea las oportunidades de atención e indicadores clave en tiempo real para el informe de grado.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <button 
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-95 border border-transparent hover:border-primary/20" 
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${isRefreshing ? 'rotate-180 text-primary' : ''}`}>
                    refresh
                  </span>
                  <span>Actualizar datos</span>
                </button>

                <button 
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-transparent hover:border-outline/20" 
                  type="button"
                  title="Imprimir reporte o guardar como PDF"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Imprimir</span>
                </button>

                {/* CRITICAL PRIMARY EXPORT BUTTON (RF-04) */}
                <button 
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_8px_20px_rgba(0,104,95,0.24)] hover:shadow-[0_12px_24px_rgba(0,104,95,0.32)] hover:scale-[1.02] active:scale-[0.98] transition-all" 
                  type="button"
                  title="Exportar base de métricas a Excel / CSV para el informe final"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span className="font-semibold">Exportar a Excel</span>
                </button>
              </div>
            </div>

          </div>

          {/* Filters Strip */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-space-sm mb-space-lg shadow-[0_2px_12px_rgba(0,104,95,0.04)] flex flex-wrap items-center justify-between gap-space-sm border border-surface-container-low">
            <div className="flex flex-wrap items-center gap-space-sm">
              
              {/* Date range selector */}
              <div className="relative">
                <select 
                  value={periodFilter}
                  onChange={(e) => {
                    setPeriodFilter(e.target.value);
                    showToast('Filtro de periodo actualizado');
                  }}
                  className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all"
                >
                  <option value="este_mes">Este Mes (Octubre)</option>
                  <option value="mes_anterior">Mes Anterior (Septiembre)</option>
                  <option value="trimestre">Trimestre Actual</option>
                  <option value="año">Año 2026</option>
                </select>
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-primary text-[18px] pointer-events-none">calendar_month</span>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">expand_more</span>
              </div>

              {/* Scope filter */}
              <div className="relative">
                <select className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all">
                  <option>Últimos 30 días</option>
                  <option>Últimos 14 días</option>
                  <option>Últimos 7 días</option>
                </select>
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">history</span>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">expand_more</span>
              </div>



            </div>

            {/* Sync Status */}
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm pl-2">
              <span className="material-symbols-outlined text-primary text-[16px]">sync_saved_locally</span>
              <span>Datos sincronizados: <strong className="text-on-surface font-semibold">{syncTime}</strong></span>
            </div>
          </div>

          {/* KPI GRID: 7 Requerimientos Clave (SRS RF-03) */}
          <div className="flex flex-col gap-space-md mb-space-lg">
            
            {/* Row 1: Flow and Conversion (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              
              {/* 1. Oportunidades Identificadas */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.07)] transition-all flex flex-col justify-between group border border-transparent hover:border-primary/20">
                <div className="flex items-start justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">1. Oportunidades Identificadas</span>
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">pets</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">{metrics.total_identificadas}</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+14%
                  </span>
                </div>
                <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm">
                  Total registradas en recepción
                </div>
              </div>

              {/* 2. Oportunidades Gestionadas */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.07)] transition-all flex flex-col justify-between group border border-transparent hover:border-secondary/20">
                <div className="flex items-start justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">2. Oportunidades Gestionadas</span>
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">support_agent</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">{metrics.total_gestionadas}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                    {((metrics.total_gestionadas / (metrics.total_identificadas || 1)) * 100).toFixed(1)}% tasa
                  </span>
                </div>
                <div className="mt-2 w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (metrics.total_gestionadas / (metrics.total_identificadas || 1)) * 100)}%` }}></div>
                </div>
              </div>

              {/* 3. Citas Generadas */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.07)] transition-all flex flex-col justify-between group border border-transparent hover:border-tertiary/20">
                <div className="flex items-start justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">3. Citas Generadas</span>
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">event_available</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">{metrics.citas_generadas}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                    {((metrics.citas_generadas / (metrics.total_identificadas || 1)) * 100).toFixed(1)}% conv.
                  </span>
                </div>
                <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">trending_up</span>
                  <span>+6 citas sobre meta mensual</span>
                </div>
              </div>

              {/* 4. Consultas Concretadas & Pacientes Recuperados */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.07)] transition-all flex flex-col justify-between group border border-transparent hover:border-tertiary/20">
                <div className="flex items-start justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">4. Consultas Concretadas</span>
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/50 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface">{metrics.consultas_concretadas}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">medical_services</span>
                    {metrics.pacientes_recuperados} Recuperados
                  </span>
                </div>
                <div className="mt-2 text-tertiary font-label-sm text-label-sm font-semibold">
                  5. Pacientes recuperados con éxito
                </div>
              </div>

            </div>

            {/* Row 2: Clinical Specialties Cards (6. Med General y 7. Med Interna) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              
              {/* 6. Medicina General */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_8px_20px_rgba(0,104,95,0.08)] transition-all flex items-center justify-between border border-transparent hover:border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">stethoscope</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">6. Especialidad Clínica</span>
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">Medicina General</span>
                    <span className="font-body-sm text-body-sm text-primary font-medium">{((metrics.consultas_general / (metrics.consultas_concretadas || 1)) * 100).toFixed(1)}% del total de consultas cerradas</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-display-lg text-display-lg font-bold text-primary">{metrics.consultas_general}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Citas efectivas</span>
                </div>
              </div>

              {/* 7. Medicina Interna */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,95,0.04)] hover:shadow-[0_8px_20px_rgba(0,104,95,0.08)] transition-all flex items-center justify-between border border-transparent hover:border-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">monitor_heart</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">7. Alta Complejidad</span>
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">Medicina Interna</span>
                    <span className="font-body-sm text-body-sm text-secondary font-medium">{((metrics.consultas_interna / (metrics.consultas_concretadas || 1)) * 100).toFixed(1)}% de derivaciones especializadas</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-display-lg text-display-lg font-bold text-secondary">{metrics.consultas_interna}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Citas efectivas</span>
                </div>
              </div>

            </div>
          </div>

          {/* ANALYTICS CHARTS SECTION (Donut & Funnel Pipeline) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mb-space-lg">
            
            {/* Left Card: Servicios de Interés (Donut Chart) - 5 Cols */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,104,95,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Servicios de Interés</h2>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">
                    Distribución
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Comparativa de demanda clínica y volumen de atenciones realizadas
                </p>

                {/* SVG Donut Chart */}
                <div className="relative flex items-center justify-center my-4">
                  <svg className="w-56 h-56 transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" fill="none" r="62" stroke="#eff4ff" strokeWidth="18"></circle>
                    {dashGeneral > 0 && (
                      <circle className="transition-all duration-1000 ease-out" cx="80" cy="80" fill="none" r="62" stroke="#00685f" strokeDasharray={`${dashGeneral.toFixed(1)} ${circumference.toFixed(1)}`} strokeDashoffset="0" strokeLinecap="round" strokeWidth="18"></circle>
                    )}
                    {dashInterna > 0 && (
                      <circle className="transition-all duration-1000 ease-out" cx="80" cy="80" fill="none" r="62" stroke="#00687a" strokeDasharray={`${dashInterna.toFixed(1)} ${circumference.toFixed(1)}`} strokeDashoffset={`-${dashGeneral.toFixed(1)}`} strokeLinecap="round" strokeWidth="18"></circle>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display-lg text-display-lg font-bold text-on-surface leading-none">{metrics.consultas_concretadas}</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold mt-1">Consultas</span>
                  </div>
                </div>
              </div>

              {/* Legend / Metric Chips */}
              <div className="flex flex-col gap-space-sm pt-4 border-t-0">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-primary-fixed"></span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Medicina General</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Preventiva, vacunas, desparasitación</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-lg text-label-lg font-bold text-primary">{metrics.consultas_general} citas</span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">{pctGeneral.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-secondary-fixed"></span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Medicina Interna</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Cardiología, nefrología, ecografías</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-lg text-label-lg font-bold text-secondary">{metrics.consultas_interna} citas</span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">{pctInterna.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary-fixed/20 text-on-surface mt-1">
                  <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    Ticket Promedio Estimado
                  </span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">$145.000 COP</span>
                </div>
              </div>
            </div>

            {/* Right Card: Estado de Oportunidades (Horizontal Pipeline Funnel) - 7 Cols */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,104,95,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Embudo del Ciclo de Atención</h2>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                    Por volumen de casos
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Embudo operativo del ciclo de atención desde el primer contacto hasta el cierre clínico
                </p>

                {/* Pipeline Horizontal Bars */}
                <div className="flex flex-col gap-4">
                  {/* 1. Pendientes */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-md text-label-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                        <span className="text-on-surface font-semibold">Pendientes de Contacto</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#fef3c7] text-[#b45309] font-label-sm text-label-sm font-bold">
                          {metrics.pendientes} casos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-body-sm text-body-sm">Por gestionar</span>
                        <span className="font-bold text-on-surface">{pctPendientes}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div className="bg-[#f59e0b] h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pctPendientes}%` }}></div>
                    </div>
                  </div>

                  {/* 1.5 En Gestión */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-md text-label-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                        <span className="text-on-surface font-semibold">En Gestión / Seguimiento</span>
                        <span className="px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-bold">
                          {metrics.en_gestion} casos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-body-sm text-body-sm">Contacto activo</span>
                        <span className="font-bold text-on-surface">{pctEnGestion}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pctEnGestion}%` }}></div>
                    </div>
                  </div>

                  {/* 2. Citas Agendadas */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-md text-label-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                        <span className="text-on-surface font-semibold">Citas Agendadas</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#dbeafe] text-[#1d4ed8] font-label-sm text-label-sm font-bold">
                          {metrics.citas_generadas} casos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-body-sm text-body-sm">En agenda clínica</span>
                        <span className="font-bold text-on-surface">{pctCitas}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pctCitas}%` }}></div>
                    </div>
                  </div>

                  {/* 3. Concretados */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-md text-label-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <span className="text-on-surface font-semibold">Consultas Concretadas (Efectivas)</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary-fixed/50 text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                          {metrics.consultas_concretadas} casos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-tertiary font-body-sm text-body-sm font-semibold">+${(metrics.consultas_concretadas * 145000).toLocaleString('es-CO')} COP</span>
                        <span className="font-bold text-primary">{pctConcretadas}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pctConcretadas}%` }}></div>
                    </div>
                  </div>

                  {/* 4. Rechazados */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-label-md text-label-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                        <span className="text-on-surface font-semibold">Rechazados / No Concretados</span>
                        <span className="px-2 py-0.5 rounded-md bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                          {metrics.rechazados} casos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant font-body-sm text-body-sm">Sin disponibilidad / Precio</span>
                        <span className="font-bold text-on-surface">{pctRechazados}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div className="bg-error/80 h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pctRechazados}%` }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Funnel Meta Insights */}
              <div className="grid grid-cols-2 gap-space-sm pt-6 mt-4">
                <div className="bg-surface-container-low/50 p-3.5 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">speed</span>
                  <div>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">Velocidad de Contacto</span>
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">18 min</span>
                  </div>
                </div>
                <div className="bg-surface-container-low/50 p-3.5 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">assignment_turned_in</span>
                  <div>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">Cumplimiento Agenda</span>
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">94.8%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>



        </div>

        {/* Toast Notification element */}
        <div className={`fixed bottom-6 right-8 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 pointer-events-none ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
          <span className="material-symbols-outlined text-primary-fixed text-[22px]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold">{toastMsg}</span>
        </div>

      </div>
    </main>
  );
}
