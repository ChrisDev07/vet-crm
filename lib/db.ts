import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface NuevoRegistroPayload {
  nombre_tutor: string;
  nombre_paciente: string;
  especie: 'Canino' | 'Felino' | 'Otro';
  telefono: string;
  servicio_interes: 'Medicina General' | 'Medicina Interna';
  tipo_oportunidad:
    | 'Solicitud de información'
    | 'Cita no concretada'
    | 'Cancelación'
    | 'Inasistencia'
    | 'Sin nueva atención registrada';
  motivo?: string;
  observaciones?: string;
  fecha_propuesta_seguimiento?: string;
}

export interface OportunidadConPaciente {
  id: number;
  paciente_id: number;
  fecha_registro: string;
  servicio_interes: string;
  tipo_oportunidad: string;
  motivo: string | null;
  observaciones: string | null;
  fecha_propuesta_seguimiento: string | null;
  estado: 'Pendiente' | 'En Gestión' | 'Cita Agendada' | 'Consulta Concretada' | 'Rechazado';
  resultado_gestion: string | null;
  fecha_actualizacion: string;
  pacientes: {
    id: number;
    nombre_tutor: string;
    telefono: string;
    nombre_paciente: string;
    especie: string;
  };
}

export interface MetricasDashboard {
  total_identificadas: number;
  total_gestionadas: number;
  citas_generadas: number;
  consultas_concretadas: number;
  pacientes_recuperados: number;
  consultas_general: number;
  consultas_interna: number;
}

/**
 * Registra una nueva oportunidad creando primero el paciente y luego la oportunidad
 */
export async function crearOportunidad(payload: NuevoRegistroPayload) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase no está configurado. Revisa las variables en .env.local');
  }

  // 1. Insertar el paciente
  const { data: pacienteData, error: pacienteError } = await supabase
    .from('pacientes')
    .insert([
      {
        nombre_tutor: payload.nombre_tutor.trim(),
        telefono: payload.telefono.trim(),
        nombre_paciente: payload.nombre_paciente.trim(),
        especie: payload.especie,
      },
    ])
    .select('id')
    .single();

  if (pacienteError || !pacienteData) {
    throw new Error(`Error al registrar paciente: ${pacienteError?.message}`);
  }

  // 2. Insertar la oportunidad vinculada al paciente
  const { data: oportunidadData, error: oportunidadError } = await supabase
    .from('oportunidades')
    .insert([
      {
        paciente_id: pacienteData.id,
        servicio_interes: payload.servicio_interes,
        tipo_oportunidad: payload.tipo_oportunidad,
        motivo: payload.motivo?.trim() || null,
        observaciones: payload.observaciones?.trim() || null,
        fecha_propuesta_seguimiento: payload.fecha_propuesta_seguimiento || null,
        estado: 'Pendiente',
      },
    ])
    .select()
    .single();

  if (oportunidadError || !oportunidadData) {
    throw new Error(`Error al registrar oportunidad: ${oportunidadError?.message}`);
  }

  return oportunidadData;
}

/**
 * Obtiene todas las oportunidades unidas con sus pacientes
 */
export async function obtenerOportunidades(): Promise<OportunidadConPaciente[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('oportunidades')
    .select(`
      id,
      paciente_id,
      fecha_registro,
      servicio_interes,
      tipo_oportunidad,
      motivo,
      observaciones,
      fecha_propuesta_seguimiento,
      estado,
      resultado_gestion,
      fecha_actualizacion,
      pacientes (
        id,
        nombre_tutor,
        telefono,
        nombre_paciente,
        especie
      )
    `)
    .order('fecha_registro', { ascending: false });

  if (error) {
    console.error('Error al obtener oportunidades:', error);
    return [];
  }

  return (data as unknown as OportunidadConPaciente[]) || [];
}

/**
 * Actualiza el estado y nota de una oportunidad
 */
export async function actualizarEstadoOportunidad(
  id: number,
  estado: 'Pendiente' | 'En Gestión' | 'Cita Agendada' | 'Consulta Concretada' | 'Rechazado',
  resultado_gestion?: string
) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase no está configurado');
  }

  const { data, error } = await supabase
    .from('oportunidades')
    .update({
      estado,
      resultado_gestion: resultado_gestion || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar estado: ${error.message}`);
  }

  return data;
}

/**
 * Obtiene las 7 métricas del plan de mejoramiento directamente desde PostgreSQL
 */
export async function obtenerMetricasDashboard(): Promise<MetricasDashboard> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      total_identificadas: 0,
      total_gestionadas: 0,
      citas_generadas: 0,
      consultas_concretadas: 0,
      pacientes_recuperados: 0,
      consultas_general: 0,
      consultas_interna: 0,
    };
  }

  const { data, error } = await supabase
    .from('vista_metricas_dashboard')
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error al obtener métricas:', error);
    return {
      total_identificadas: 0,
      total_gestionadas: 0,
      citas_generadas: 0,
      consultas_concretadas: 0,
      pacientes_recuperados: 0,
      consultas_general: 0,
      consultas_interna: 0,
    };
  }

  return {
    total_identificadas: Number(data.total_identificadas) || 0,
    total_gestionadas: Number(data.total_gestionadas) || 0,
    citas_generadas: Number(data.citas_generadas) || 0,
    consultas_concretadas: Number(data.consultas_concretadas) || 0,
    pacientes_recuperados: Number(data.pacientes_recuperados) || 0,
    consultas_general: Number(data.consultas_general) || 0,
    consultas_interna: Number(data.consultas_interna) || 0,
  };
}

export interface ResultadoBusqueda {
  id: number;
  nombre_paciente: string;
  nombre_tutor: string;
  telefono: string;
  especie: string;
  servicio_interes?: string;
  estado?: string;
}

/**
 * Busca pacientes y oportunidades por nombre, tutor o teléfono
 */
export async function buscarPacientesYOportunidades(
  query: string
): Promise<ResultadoBusqueda[]> {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = query.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('oportunidades')
        .select(`
          id,
          servicio_interes,
          estado,
          pacientes (
            id,
            nombre_tutor,
            telefono,
            nombre_paciente,
            especie
          )
        `)
        .order('fecha_registro', { ascending: false })
        .limit(100);

      if (!error && data) {
        const matches: ResultadoBusqueda[] = [];
        for (const item of data as unknown as OportunidadConPaciente[]) {
          if (!item.pacientes) continue;
          const matchPet = item.pacientes.nombre_paciente?.toLowerCase().includes(cleanQuery);
          const matchTutor = item.pacientes.nombre_tutor?.toLowerCase().includes(cleanQuery);
          const matchPhone = item.pacientes.telefono?.includes(cleanQuery);

          if (matchPet || matchTutor || matchPhone) {
            matches.push({
              id: item.id,
              nombre_paciente: item.pacientes.nombre_paciente,
              nombre_tutor: item.pacientes.nombre_tutor,
              telefono: item.pacientes.telefono,
              especie: item.pacientes.especie,
              servicio_interes: item.servicio_interes,
              estado: item.estado,
            });
          }
          if (matches.length >= 6) break;
        }
        return matches;
      }
    } catch (err) {
      console.error('Error en búsqueda de Supabase:', err);
    }
  }

  // Fallback con datos locales si Supabase no está configurado o no arroja resultados
  const fallbackList: ResultadoBusqueda[] = [
    { id: 1, nombre_paciente: 'Firulais', nombre_tutor: 'Juan Pérez', telefono: '300 123 4567', especie: 'Canino', servicio_interes: 'Medicina General', estado: 'Pendiente' },
    { id: 2, nombre_paciente: 'Misi', nombre_tutor: 'Mariana Palacios', telefono: '312 984 2190', especie: 'Felino', servicio_interes: 'Medicina Interna', estado: 'En Gestión' },
    { id: 3, nombre_paciente: 'Rocky', nombre_tutor: 'Carlos Méndez', telefono: '315 432 9876', especie: 'Canino', servicio_interes: 'Medicina General', estado: 'Cita Agendada' },
    { id: 4, nombre_paciente: 'Luna', nombre_tutor: 'Camila Restrepo', telefono: '315 776 5432', especie: 'Felino', servicio_interes: 'Medicina Interna', estado: 'Pendiente' },
    { id: 5, nombre_paciente: 'Thor', nombre_tutor: 'Roberto Luna', telefono: '311 654 9870', especie: 'Canino', servicio_interes: 'Medicina General', estado: 'Consulta Concretada' },
    { id: 6, nombre_paciente: 'Simba', nombre_tutor: 'Sofía Echeverri', telefono: '320 876 1234', especie: 'Felino', servicio_interes: 'Medicina General', estado: 'Pendiente' },
  ];

  return fallbackList.filter(
    (item) =>
      item.nombre_paciente.toLowerCase().includes(cleanQuery) ||
      item.nombre_tutor.toLowerCase().includes(cleanQuery) ||
      item.telefono.includes(cleanQuery)
  );
}
