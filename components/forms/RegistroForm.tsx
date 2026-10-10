'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Dog, Calendar, Stethoscope, ClipboardList, Info, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre_tutor: '',
    nombre_paciente: '',
    especie: 'Canino',
    telefono: '',
    servicio_interes: 'Medicina General',
    tipo_oportunidad: 'Solicitud de información',
    motivo: '',
    observaciones: '',
    fecha_propuesta_seguimiento: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          ...formData,
          nombre_tutor: '',
          nombre_paciente: '',
          telefono: '',
          motivo: '',
          observaciones: '',
        });
      }, 3500);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 shadow-sm transition-all duration-300 outline-none hover:border-teal-300 font-medium text-[15px]";
  const labelClasses = "block text-sm font-bold text-slate-700 ml-1 mb-1.5 tracking-wide";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-4xl mx-auto w-full"
    >
      {/* Fondo difuminado detrás del formulario (Aguamarina) */}
      <div className="absolute top-0 -left-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
      <div className="absolute top-20 -right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <form 
        onSubmit={handleSubmit} 
        className="relative space-y-8 p-6 sm:p-12 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,128,128,0.1)] border border-white"
      >
        <motion.div layout className="text-center mb-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-teal-50 text-teal-700 text-xs font-bold tracking-widest mb-4 border border-teal-100 uppercase">
            Sistema Recepción MVP
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Nueva <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Oportunidad</span>
          </h2>
          <p className="text-slate-500 mt-3 text-lg font-medium">Registra al prospecto rápidamente en el sistema.</p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border-2 border-green-100 flex flex-col items-center justify-center text-center space-y-5"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-white shadow-xl shadow-green-200/50 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-extrabold text-green-800 mb-2">¡Registro Exitoso!</h3>
                <p className="text-green-600 font-medium text-lg">Los datos han sido guardados correctamente en la base de datos.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Bloque 1: Tutor y Paciente */}
              <div className="bg-slate-50/80 p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-teal-600 border border-slate-100">
                    <User className="w-6 h-6"/>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">1. Datos del Cliente</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-1">
                    <label className={labelClasses}>Nombre del Tutor</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <User className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                      <input type="text" name="nombre_tutor" value={formData.nombre_tutor} onChange={handleChange} required className={inputClasses} placeholder="Ej. Juan Pérez" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClasses}>Teléfono de Contacto</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Phone className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className={inputClasses} placeholder="Ej. 300 123 4567" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClasses}>Nombre del Paciente</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Dog className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                      <input type="text" name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} required className={inputClasses} placeholder="Ej. Firulais" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClasses}>Especie</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Dog className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors z-10" />
                      <select name="especie" value={formData.especie} onChange={handleChange} className={`${inputClasses} appearance-none relative`}>
                        <option>Canino</option>
                        <option>Felino</option>
                        <option>Otro</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-[14px] w-5 h-5 text-slate-400 pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Detalles de la Oportunidad */}
              <div className="bg-slate-50/80 p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-cyan-600 border border-slate-100">
                    <ClipboardList className="w-6 h-6"/>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">2. Detalles del Caso</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-1">
                    <label className={labelClasses}>Servicio de Interés</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Stethoscope className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors z-10" />
                      <select name="servicio_interes" value={formData.servicio_interes} onChange={handleChange} className={`${inputClasses} appearance-none relative`}>
                        <option>Medicina General</option>
                        <option>Medicina Interna</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-[14px] w-5 h-5 text-slate-400 pointer-events-none" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClasses}>Tipo de Oportunidad</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Info className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors z-10" />
                      <select name="tipo_oportunidad" value={formData.tipo_oportunidad} onChange={handleChange} className={`${inputClasses} appearance-none relative`}>
                        <option>Solicitud de información</option>
                        <option>Cita no concretada</option>
                        <option>Cancelación</option>
                        <option>Inasistencia</option>
                        <option>Sin nueva atención registrada</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-[14px] w-5 h-5 text-slate-400 pointer-events-none" />
                    </motion.div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className={labelClasses}>Motivo Principal</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <MessageSquare className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                      <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} className={inputClasses} placeholder="Falta de tiempo, costo, horario, etc." />
                    </motion.div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className={labelClasses}>Observaciones Adicionales</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows={3} className={`${inputClasses} pl-5 resize-none`} placeholder="Escribe aquí cualquier contexto importante de la llamada..."></textarea>
                    </motion.div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className={labelClasses}>Fecha para Seguimiento</label>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
                      <Calendar className="absolute left-4 top-[14px] w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                      <input type="date" name="fecha_propuesta_seguimiento" value={formData.fecha_propuesta_seguimiento} onChange={handleChange} required className={inputClasses} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Botón Animado Premium Aguamarina */}
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(13, 148, 136, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-3 py-5 px-6 rounded-2xl shadow-xl text-white font-extrabold text-lg bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 bg-[length:200%_auto] hover:bg-[right_center] focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-7 h-7 border-4 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Guardar Oportunidad</span>
                    <CheckCircle2 className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
