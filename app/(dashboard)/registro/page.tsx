
'use client';

import { useState, useEffect } from 'react';

export default function RegistroPage() {
    const [selectedServices, setSelectedServices] = useState<string[]>(['Medicina General']);
  const toggleService = (s: string) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const [species, setSpecies] = useState('canino');
  const [notes, setNotes] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
    const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  
  const availableServices = [
    { name: 'Medicina General', icon: '🩺' },
    { name: 'Medicina Interna', icon: '🔬' },
    { name: 'Vacunación & Desparasitación', icon: '💉' },
    { name: 'Odontología', icon: '🦷' },
    { name: 'Cirugía / Quirófano', icon: '🏥' }
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const getQuickDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tutor = (document.getElementById("tutor-name") as HTMLInputElement)?.value;
    const pet = (document.getElementById("pet-name") as HTMLInputElement)?.value;
    if (!tutor || !pet) {
      showToast('⚠️ Por favor completa el nombre del tutor y de la mascota.');
      return;
    }
    showToast(`✅ Oportunidad registrada con éxito para ${pet} (Tutor: ${tutor})`);
  };
  return (
    <>
<main className="w-full pt-20 px-space-lg pb-space-xl bg-background min-h-screen"><div className="flex flex-col w-full">
{/* Subtle ambient decorative glow (contained) */}
<div className="relative w-full">
<div className="absolute -top-10 right-20 w-72 h-72 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="absolute top-96 left-10 w-96 h-96 bg-secondary-fixed/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
{/* Top Meta / Breadcrumb + Title Row */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div className="flex flex-col gap-1">
<nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-1">
<a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-[15px]">home</span>
            Inicio
          </a>
<span className="text-outline-variant">/</span>
<span className="text-outline">Oportunidades</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-semibold">Registrar</span>
</nav>
<div className="flex items-center gap-3">
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Nueva Oportunidad</h1>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Recepción Activa
          </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Registra al prospecto rápidamente en el sistema y asegura el seguimiento oportuno del paciente clínico.
        </p>
</div>
{/* Quick stats pill for receptionists */}
<div className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest shadow-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">bolt</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-outline">Tiempo promedio de alta</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">1 min 24 seg</span>
</div>
</div>
</div>
{/* Main Dual Column Workspace Layout */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/* LEFT / CENTRAL COLUMN: Core Clinical CRM Intake Form (8 cols) */}
<form className="xl:col-span-8 flex flex-col gap-space-lg" id="lead-form" >
{/* CARD 1: Datos del Cliente y Paciente */}
<div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 lg:p-space-lg relative overflow-hidden transition-all">
{/* Subtle watermark icon */}
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-surface-container/60 text-[120px] select-none pointer-events-none -z-0">pets</span>
<div className="relative z-10 flex flex-col gap-6">
{/* Card Header */}
<div className="flex items-center justify-between pb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">person_pin_circle</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Datos del Tutor y Paciente</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Información de contacto principal e identidad de la mascota</p>
</div>
</div>
<span className="font-label-sm text-label-sm text-outline bg-surface-container-low px-2.5 py-1 rounded-md">Paso 1 de 2</span>
</div>
{/* Form Grid: 2 Columns */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
{/* Nombre del Tutor */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="tutor-name">
                  Nombre del Tutor
                  <span className="text-error">*</span>
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">account_circle</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="tutor-name" placeholder="Ej. Carlos Méndez Silva" required type="text"/>
</div>
</div>
{/* Teléfono / WhatsApp con prefijo */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="tutor-phone">
                  Teléfono / WhatsApp
                  <span className="text-error">*</span>
</label>
<div className="relative flex items-center rounded-xl bg-surface-container-low/70 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary transition-all shadow-inner overflow-hidden">
<div className="flex items-center pl-3 pr-2 text-outline bg-surface-container/50">
<span className="material-symbols-outlined text-[18px] mr-1">chat</span>
<span className="bg-transparent text-label-sm font-label-sm text-on-surface py-2.5 pr-1">+57 (CO)</span>
</div>
<input className="w-full pl-3 pr-4 py-2.5 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" id="tutor-phone" placeholder="Ej. 55 4321 9876" required type="tel"/>
</div>
</div>
{/* Nombre del Paciente */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="pet-name">
                  Nombre del Paciente (Mascota)
                  <span className="text-error">*</span>
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">pets</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="pet-name" placeholder="Ej. Milo, Luna, Rocky..." required type="text"/>
</div>
</div>
{/* Raza del Paciente */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="pet-breed">
                  Raza
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">category</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="pet-breed" placeholder="Ej. Golden Retriever, Mestizo..." type="text"/>
</div>
</div>
{/* Edad del Paciente */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="pet-age">
                  Edad
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">cake</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="pet-age" placeholder="Ej. 2 años, 6 meses..." type="text"/>
</div>
</div>
{/* Selector Interactivo de Especie */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center justify-between">
<span>Especie del Paciente <span className="text-error">*</span></span>
<span className="text-outline text-body-sm text-[11px]">Selección rápida</span>
</label>
<div className="grid grid-cols-2 gap-2" id="species-toggle-group">
{/* Botón 1: Canino (Selected default) */}
<button 
  className={`species-btn flex items-center justify-between px-3.5 py-2 rounded-xl transition-all text-left ${species === 'canino' ? 'text-primary bg-primary-fixed/30 shadow-sm font-bold' : 'text-on-surface bg-surface-container-low/70 hover:bg-surface-container font-semibold'}`} 
  id="species-canino" 
  type="button"
  onClick={() => setSpecies('canino')}
>
  <span className="flex items-center gap-2 font-label-md text-label-md">
    <span className="text-base">🐶</span>
    <span>Canino</span>
  </span>
  <span className={`material-symbols-outlined text-[16px] ${species === 'canino' ? 'text-primary' : 'text-transparent'}`}>check_circle</span>
</button>
{/* Botón 2: Felino */}
<button 
  className={`species-btn flex items-center justify-between px-3.5 py-2 rounded-xl transition-all text-left ${species === 'felino' ? 'text-primary bg-primary-fixed/30 shadow-sm font-bold' : 'text-on-surface bg-surface-container-low/70 hover:bg-surface-container font-semibold'}`} 
  id="species-felino" 
  type="button"
  onClick={() => setSpecies('felino')}
>
  <span className="flex items-center gap-2 font-label-md text-label-md">
    <span className="text-base">🐱</span>
    <span>Felino</span>
  </span>
  <span className={`material-symbols-outlined text-[16px] ${species === 'felino' ? 'text-primary' : 'text-transparent'}`}>check_circle</span>
</button>
</div>
</div>
{/* Selector alternativo: Otra especie o datos clínicos menores */}
<div className="md:col-span-2 flex items-center justify-between pt-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-[16px]">info</span>
<span className="font-body-sm text-body-sm text-outline">¿El paciente no es perro o gato?</span>
</div>
<div className="relative">
<select className="bg-surface-container-low text-primary font-label-sm text-label-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer" value={['canino', 'felino'].includes(species) ? '' : species} onChange={(e) => setSpecies(e.target.value)}>
<option value="">Seleccionar especie exótica...</option>
<option value="ave">🦜 Ave / Psitácida</option>
<option value="conejo">🐰 Conejo / Lagomorfo</option>
<option value="roedor">🐹 Pequeño Roedor</option>
<option value="reptil">🦎 Reptil</option>
<option value="otro">Otro animal de compañía</option>
</select>
</div>
</div>
</div>
</div>
</div>
{/* CARD 2: Detalles del Caso Clínico */}
<div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 lg:p-space-lg relative transition-all">
<div className="flex flex-col gap-6">
{/* Card Header */}
<div className="flex items-center justify-between pb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">stethoscope</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Detalles del Caso Clínico</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Motivo, especialidad médica y planificación del contacto</p>
</div>
</div>
<span className="font-label-sm text-label-sm text-outline bg-surface-container-low px-2.5 py-1 rounded-md">Paso 2 de 2</span>
</div>
{/* Servicio de Interés (Chips visuales interactivos) */}
<div className="flex flex-col gap-2">
<label className="font-label-sm text-label-sm text-on-surface flex items-center justify-between">
<span>Servicio de Interés <span className="text-error">*</span></span>
<span className="text-outline text-body-sm text-[11px]">Haz clic para seleccionar uno o más</span>
</label>
<div className="flex flex-wrap gap-2.5" id="services-chips">
  {availableServices.map(s => {
    const isActive = selectedServices.includes(s.name);
    return (
      <button 
        key={s.name}
        className={`service-chip flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-md text-label-md transition-all shadow-xs ${isActive ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
        type="button"
        onClick={() => toggleService(s.name)}
      >
        <span className="text-base">{s.icon}</span>
        <span>{s.name}</span>
        <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-tertiary' : 'text-transparent'}`}>check</span>
      </button>
    );
  })}
</div>
</div>
{/* Grid: Tipo de Oportunidad & Motivo Principal */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
{/* Tipo de Oportunidad (Select estilizado) */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="opportunity-type">
                  Tipo de Oportunidad
                  <span className="text-error">*</span>
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">category</span>
<select className="w-full pl-10 pr-9 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer shadow-inner" id="opportunity-type" required>
<option value="primera">Primera Consulta (Nuevo Ingreso)</option>
<option value="post-op">Control Post-Cirugía</option>
<option value="urgencia">Urgencia Menor / Triage Rápido</option>
<option value="derivacion">Derivación Especializada</option>
<option value="chequeo">Chequeo Preventivo / Sénior</option>
</select>
<span className="material-symbols-outlined absolute right-3 pointer-events-none text-outline text-[18px]">expand_more</span>
</div>
</div>
{/* Motivo Principal de Consulta */}
<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1" htmlFor="main-reason">
                  Motivo Principal de Consulta
                  <span className="text-error">*</span>
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">content_paste</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="main-reason" placeholder="Ej. Tos seca hace 2 días, decaído" required type="text"/>
</div>
</div>
</div>
{/* Observaciones Adicionales con contador */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1.5" htmlFor="clinical-notes">
<span className="material-symbols-outlined text-[16px] text-outline">description</span>
                  Observaciones Adicionales &amp; Antecedentes
                </label>
<span className="font-label-sm text-label-sm text-outline" id="char-counter">{notes.length} / 400</span>
</div>
<div className="relative">
<textarea className="w-full p-3.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner" id="clinical-notes" maxLength={400} placeholder="Ingresa detalles sobre antecedentes médicos, medicamentos actuales, temperamento del paciente o preferencias de horario del tutor..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
</div>
</div>
{/* Fecha para Seguimiento + Quick Suggestions */}
<div className="flex flex-col gap-2 pt-1">
<label className="font-label-sm text-label-sm text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">calendar_clock</span>
                Fecha y Turno Estimado para Seguimiento
              </label>
<div className="grid grid-cols-1 md:grid-cols-12 gap-3">
<div className="md:col-span-6 relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 pointer-events-none text-outline text-[18px]">event</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/70 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner" id="follow-date" type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} />
</div>
{/* Quick buttons for date presets */}
<div className="md:col-span-6 flex items-center gap-1.5">
<button className="quick-date-btn flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-primary-fixed/40 hover:text-primary transition-colors text-center" type="button" onClick={() => setDate(getQuickDate(0))}>Hoy</button>
<button className="quick-date-btn flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-primary-fixed/40 hover:text-primary transition-colors text-center" type="button" onClick={() => setDate(getQuickDate(1))}>Mañana</button>
<button className="quick-date-btn flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-primary-fixed/40 hover:text-primary transition-colors text-center" type="button" onClick={() => setDate(getQuickDate(3))}>+3 días</button>
<button className="quick-date-btn flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-primary-fixed/40 hover:text-primary transition-colors text-center" type="button" onClick={() => setDate(getQuickDate(7))}>1 sem.</button>
</div>
</div>
</div>
</div>
</div>
{/* Form Action Footer Bar */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm">
<div className="flex items-center gap-3 w-full sm:w-auto">
<button className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2" type="reset" onClick={() => { setSpecies('canino'); setSelectedServices(['Medicina General']); setNotes(''); setDate(getQuickDate(0)); showToast('Formulario restablecido'); }}>
<span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Limpiar campos
            </button>
<button className="hidden sm:inline-flex px-4 py-2.5 rounded-xl font-label-md text-label-md text-secondary bg-surface-container-low hover:bg-secondary-fixed/30 transition-colors items-center gap-2" type="button" onClick={() => showToast('Oportunidad guardada en borradores')}>
<span className="material-symbols-outlined text-[18px]">save_as</span>
              Guardar borrador
            </button>
</div>
{/* Primary Submit CTA Button with Gradient & Shadow Lift */}
<button className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-3 group"  type="submit">
<span>Guardar Oportunidad</span>
<span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
</button>
</div>
</form>
{/* RIGHT COLUMN: Reception Support Sidebar & Today's Follow-ups (4 cols) */}
<aside className="xl:col-span-4 flex flex-col gap-space-lg">
{/* Main Tracking Card: 'Seguimientos Prioritarios (Hoy)' */}
<div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 lg:p-6 flex flex-col gap-5">
{/* Card Header with pending badge */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-secondary text-[22px]">calendar_month</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">Seguimientos (Hoy)</h3>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
              4 pendientes
            </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant -mt-2">
            Mascotas agendadas para contacto en el turno actual
          </p>
{/* List of Actionable Mini-Cards */}
<div className="flex flex-col gap-3">
{/* Caso 1: Simba */}
<div className="p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all flex flex-col gap-2.5 shadow-xs">
<div className="flex items-start justify-between gap-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xl shadow-inner">
                    🐱
                  </div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-label-lg text-label-lg text-on-surface font-bold">Simba</span>
<span className="font-body-sm text-body-sm text-outline">• 2 años</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Tutor: Lucía Fernández</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center shadow-xs" title="Llamar a tutor" type="button" onClick={() => showToast('Iniciando llamada con tutor...')}>
<span className="material-symbols-outlined text-[17px]">call</span>
</button>
</div>
<div className="flex items-center justify-between pt-1">
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[15px] text-outline">vaccines</span>
<span>Vacuna Triple Felina</span>
</div>
<span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-semibold">
                  Llamada pendiente
                </span>
</div>
</div>
{/* Caso 2: Thor */}
<div className="p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all flex flex-col gap-2.5 shadow-xs">
<div className="flex items-start justify-between gap-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xl shadow-inner">
                    🐶
                  </div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-label-lg text-label-lg text-on-surface font-bold">Thor</span>
<span className="font-body-sm text-body-sm text-outline">• Bulldog</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Tutor: Mateo Rivas</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-tertiary hover:bg-tertiary hover:text-on-tertiary transition-all flex items-center justify-center shadow-xs" title="Abrir WhatsApp" type="button" onClick={() => showToast('Abriendo conversación de WhatsApp...')}>
<span className="material-symbols-outlined text-[17px]">chat</span>
</button>
</div>
<div className="flex items-center justify-between pt-1">
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[15px] text-outline">healing</span>
<span>Revisión herida quirúrgica</span>
</div>
<span className="px-2 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[11px] font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Confirmado 16:30
                </span>
</div>
</div>
{/* Caso 3: Kira */}
<div className="p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all flex flex-col gap-2.5 shadow-xs">
<div className="flex items-start justify-between gap-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xl shadow-inner">
                    🐶
                  </div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-label-lg text-label-lg text-on-surface font-bold">Kira</span>
<span className="font-body-sm text-body-sm text-outline">• Poodle</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Tutor: Andrea Gómez</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center shadow-xs" title="Llamar o agendar" type="button" onClick={() => showToast('Iniciando llamada...')}>
<span className="material-symbols-outlined text-[17px]">phone_forwarded</span>
</button>
</div>
<div className="flex items-center justify-between pt-1">
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[15px] text-outline">dentistry</span>
<span>Presupuesto profilaxis dental</span>
</div>
<span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-semibold">
                  Por contactar
                </span>
</div>
</div>
</div>
{/* Métrica Rápida del Día */}
<div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
<span className="font-label-md text-label-md text-on-surface font-bold">Oportunidades Hoy</span>
</div>
<span className="font-label-md text-label-md text-primary font-bold">12 registradas</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-gradient-to-r from-primary to-tertiary h-full rounded-full transition-all duration-700" style={{"width":"85%"}}></div>
</div>
<div className="flex items-center justify-between text-body-sm text-[11px] text-outline">
<span>85% contactadas con éxito</span>
<span className="text-tertiary font-semibold">Meta diaria: 15</span>
</div>
</div>
</div>
{/* Receptionist Tip / Reminder Banner */}
<div className="p-4 rounded-2xl bg-gradient-to-br from-secondary-fixed/20 to-surface-container-lowest shadow-sm flex items-start gap-3">
<div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[18px]">lightbulb</span>
</div>
<div className="flex flex-col gap-0.5">
<span className="font-label-md text-label-md text-on-surface font-bold">Tip de Recepción</span>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Recuerda solicitar si el paciente cuenta con carnet de vacunación vigente o alergias a antibióticos previas.
            </p>
</div>
</div>
{/* Activity snippet mini-feed */}
<div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
              Último registro
            </span>
<span className="font-label-sm text-label-sm text-outline">Hace 14 min</span>
</div>
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary font-bold text-label-sm">
              RL
            </div>
<div className="flex flex-col min-w-0">
<span className="font-label-md text-label-md text-on-surface truncate">Rocky (Golden Retriever)</span>
<span className="font-body-sm text-[11px] text-outline truncate">Tutor: Roberto Luna • Derivación trauma</span>
</div>
</div>
</div>
</aside>
</div>
</div>
{/* Toast Notification element */}
<div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} id="toast-notification">
<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl">
<span className="material-symbols-outlined text-tertiary-fixed text-[20px]">check_circle</span>
<span className="font-label-md text-label-md" id="toast-message">{toastMsg}</span>
</div>
</div>
</div>
</main>
    </>
  );
}
