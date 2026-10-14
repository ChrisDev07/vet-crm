
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
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [shiftFilter, setShiftFilter] = useState<'todos' | 'mañana' | 'tarde'>('todos');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [daysList, setDaysList] = useState<Array<{ name: string; dayNum: number; monthName: string; isoDate: string }>>([]);

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const days = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return {
        name: i === 0 ? 'Hoy' : dayNames[d.getDay()],
        dayNum: d.getDate(),
        monthName: monthNames[d.getMonth()],
        isoDate: d.toISOString().split('T')[0]
      };
    });
    setDaysList(days);
  }, []);

  const scheduleSlots = [
    { id: 1, time: '08:30 AM', vet: 'Dr. Morales', service: 'Consulta General', status: 'ocupado', patient: 'Max (Labrador)', shift: 'mañana' },
    { id: 2, time: '09:45 AM', vet: 'Dra. Gómez', service: 'Vacunación Puppy', status: 'disponible', shift: 'mañana' },
    { id: 3, time: '11:15 AM', vet: 'Dr. Morales', service: 'Control Post-Op', status: 'disponible', shift: 'mañana' },
    { id: 4, time: '12:30 PM', vet: 'Dra. Gómez', service: 'Triage / Urgencia', status: 'ocupado', patient: 'Kira (Poodle)', shift: 'mañana' },
    { id: 5, time: '02:30 PM', vet: 'Dr. Morales', service: 'Profilaxis Dental', status: 'ocupado', patient: 'Thor (Bulldog)', shift: 'tarde' },
    { id: 6, time: '04:00 PM', vet: 'Dra. Gómez', service: 'Medicina General', status: 'disponible', shift: 'tarde' },
    { id: 7, time: '05:30 PM', vet: 'Dr. Morales', service: 'Cirugía Tejidos', status: 'reservado', patient: 'Simba (Felino)', shift: 'tarde' },
    { id: 8, time: '06:45 PM', vet: 'Dra. Gómez', service: 'Revisión Preventiva', status: 'disponible', shift: 'tarde' }
  ];

  const filteredSlots = scheduleSlots.filter(s => {
    if (shiftFilter === 'todos') return true;
    return s.shift === shiftFilter;
  });

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
<form className="xl:col-span-8 flex flex-col gap-space-lg" id="lead-form" onSubmit={handleSave}>
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
{/* RIGHT COLUMN: Reception Support Sidebar - Agenda & Turnos (4 cols) */}
<aside className="xl:col-span-4 flex flex-col gap-space-lg">
{/* Main Card: Agenda y Turnos */}
<div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 lg:p-6 flex flex-col gap-4">
  
  {/* Header */}
  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-[22px]">calendar_month</span>
      </div>
      <div className="flex flex-col">
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">Agenda Clínica</h3>
        <span className="font-body-sm text-[12px] text-on-surface-variant">Disponibilidad médica en vivo</span>
      </div>
    </div>
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-[11px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
      Cupos abiertos
    </span>
  </div>

  {/* 6-Day Interactive Mini-Calendar Strip */}
  <div className="flex flex-col gap-2 pt-1">
    <div className="flex items-center justify-between">
      <span className="font-label-sm text-label-sm text-on-surface font-bold">Octubre 2026</span>
      <span className="text-[11px] text-outline">Selecciona un día</span>
    </div>
    <div className="grid grid-cols-6 gap-1.5">
      {daysList.map((d, index) => {
        const isSelected = selectedDayOffset === index;
        return (
          <button
            key={d.isoDate || index}
            type="button"
            onClick={() => {
              setSelectedDayOffset(index);
              setDate(d.isoDate);
              setSelectedSlotId(null);
              showToast(`📅 Día seleccionado: ${d.name} ${d.dayNum} ${d.monthName}`);
            }}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all text-center relative ${
              isSelected
                ? 'bg-gradient-to-b from-primary to-primary-container text-on-primary shadow-sm font-bold scale-[1.03]'
                : 'bg-surface-container-low/70 hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <span className={`text-[11px] uppercase font-semibold ${isSelected ? 'text-on-primary/90' : 'text-outline'}`}>
              {d.name}
            </span>
            <span className={`text-base font-bold leading-tight ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
              {d.dayNum}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-on-primary' : (index % 2 === 0 ? 'bg-tertiary' : 'bg-primary')}`}></span>
          </button>
        );
      })}
    </div>
  </div>

  {/* Turno Filter Chips */}
  <div className="flex items-center justify-between border-t border-b border-surface-container-low py-2.5">
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setShiftFilter('todos')}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-label-sm transition-all ${
          shiftFilter === 'todos'
            ? 'bg-primary text-on-primary font-bold'
            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Todos
      </button>
      <button
        type="button"
        onClick={() => setShiftFilter('mañana')}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-label-sm flex items-center gap-1 transition-all ${
          shiftFilter === 'mañana'
            ? 'bg-primary text-on-primary font-bold'
            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span>☀️</span> Mañana
      </button>
      <button
        type="button"
        onClick={() => setShiftFilter('tarde')}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-label-sm flex items-center gap-1 transition-all ${
          shiftFilter === 'tarde'
            ? 'bg-primary text-on-primary font-bold'
            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span>🌙</span> Tarde
      </button>
    </div>
    <span className="text-[11px] text-outline font-label-sm">
      {filteredSlots.filter(s => s.status === 'disponible').length} disponibles
    </span>
  </div>

  {/* Turnos / Slots List */}
  <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-0.5">
    {filteredSlots.map(slot => {
      const isAssigned = selectedSlotId === slot.id;
      return (
        <div
          key={slot.id}
          className={`p-3 rounded-xl transition-all border flex items-center justify-between gap-3 ${
            isAssigned
              ? 'bg-primary-fixed/25 border-primary shadow-xs'
              : slot.status === 'disponible'
              ? 'bg-surface-container-low/70 hover:bg-surface-container border-transparent'
              : 'bg-surface-container-low/30 border-transparent opacity-75'
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isAssigned
                ? 'bg-primary text-on-primary'
                : slot.status === 'disponible'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                : 'bg-surface-container text-outline'
            }`}>
              <span className="material-symbols-outlined text-[17px]">
                {slot.status === 'disponible' ? 'schedule' : 'event_busy'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  {slot.time}
                </span>
                <span className="text-outline text-[11px]">• {slot.vet}</span>
              </div>
              <span className="text-body-sm text-[12px] text-on-surface-variant truncate">
                {slot.service}
              </span>
              {slot.patient && (
                <span className="text-[11px] text-outline truncate">
                  Paciente: <strong className="font-medium text-on-surface">{slot.patient}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Action button / Badge */}
          <div className="shrink-0">
            {slot.status === 'disponible' ? (
              <button
                type="button"
                onClick={() => {
                  const dayObj = daysList[selectedDayOffset];
                  if (dayObj) setDate(dayObj.isoDate);
                  setSelectedSlotId(slot.id);
                  showToast(`✅ Turno ${slot.time} (${slot.vet}) asignado a seguimiento`);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-label-sm font-semibold transition-all flex items-center gap-1 ${
                  isAssigned
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-tertiary-container/30 text-tertiary hover:bg-tertiary hover:text-on-tertiary'
                }`}
              >
                {isAssigned ? (
                  <>
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    <span>Asignado</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Asignar</span>
                  </>
                )}
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-outline text-[10px] font-label-sm font-medium">
                {slot.status === 'ocupado' ? 'Ocupado' : 'Reservado'}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>

  {/* Métrica Rápida del Día */}
  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 mt-1">
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
