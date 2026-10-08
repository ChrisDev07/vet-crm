'use client';

import { useState } from 'react';

export default function RegistroForm() {
  // Estado del formulario
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En el Sprint 2 aquí conectaremos con Supabase
    console.log('Datos a guardar:', formData);
    alert('Oportunidad registrada correctamente (Modo Local - Sprint 1)');
    
    // Resetear formulario básico
    setFormData({
      ...formData,
      nombre_tutor: '',
      nombre_paciente: '',
      telefono: '',
      motivo: '',
      observaciones: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Registro de Oportunidad</h2>
      
      {/* Sección: Paciente y Tutor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Tutor</label>
          <input type="text" name="nombre_tutor" value={formData.nombre_tutor} onChange={handleChange} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="Ej. Juan Pérez" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="Ej. 3001234567" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Paciente</label>
          <input type="text" name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="Ej. Firulais" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
          <select name="especie" value={formData.especie} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
            <option>Canino</option>
            <option>Felino</option>
            <option>Otro</option>
          </select>
        </div>
      </div>

      {/* Sección: Detalles de la Oportunidad */}
      <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mt-8">Detalles de la Interacción</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servicio de Interés</label>
          <select name="servicio_interes" value={formData.servicio_interes} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
            <option>Medicina General</option>
            <option>Medicina Interna</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Oportunidad</label>
          <select name="tipo_oportunidad" value={formData.tipo_oportunidad} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
            <option>Solicitud de información</option>
            <option>Cita no concretada</option>
            <option>Cancelación</option>
            <option>Inasistencia</option>
            <option>Sin nueva atención registrada</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo principal</label>
          <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="Ej. Falta de tiempo, costo, incompatibilidad de horario" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones adicionales</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="Agrega cualquier detalle extra sobre la llamada o visita..."></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Propuesta de Seguimiento</label>
          <input type="date" name="fecha_propuesta_seguimiento" value={formData.fecha_propuesta_seguimiento} onChange={handleChange} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" />
        </div>
      </div>

      <div className="pt-6">
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Guardar Oportunidad
        </button>
      </div>
    </form>
  );
}
