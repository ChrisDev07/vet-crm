import { supabase, isSupabaseConfigured } from './supabaseClient';

export type Especie = 'Canino' | 'Felino';

export type ServicioInteres =
  | 'Medicina General'
  | 'Medicina Interna'
  | 'Vacunación & Desparasitación'
  | 'Cirugía/Quirófano';

export type TipoOportunidad =
  | 'Solicitud de información'
  | 'Cita no concretada'
  | 'Cancelación'
  | 'Inasistencia'
  | 'Sin nueva atención registrada'
  | 'Otros';

export interface NuevoRegistroPayload {
  nombre_tutor: string;
  nombre_paciente: string;
  especie: Especie;
  telefono: string;
  servicio_interes: ServicioInteres;
  tipo_oportunidad: TipoOportunidad;
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
  consultas_vacunacion: number;
  consultas_cirugia: number;
  pendientes: number;
  en_gestion: number;
  rechazados: number;
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
        fecha_registro: new Date().toLocaleDateString('en-CA'),
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
    .order('fecha_registro', { ascending: false })
    .order('id', { ascending: false });

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

  const updatePayload: {
    estado: 'Pendiente' | 'En Gestión' | 'Cita Agendada' | 'Consulta Concretada' | 'Rechazado';
    resultado_gestion?: string | null;
  } = { estado };

  if (resultado_gestion !== undefined) {
    updatePayload.resultado_gestion = resultado_gestion || null;
  }

  const { data, error } = await supabase
    .from('oportunidades')
    .update(updatePayload)
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
export async function obtenerMetricasDashboard(dias?: number): Promise<MetricasDashboard> {
  const emptyMetrics: MetricasDashboard = {
    total_identificadas: 0,
    total_gestionadas: 0,
    citas_generadas: 0,
    consultas_concretadas: 0,
    pacientes_recuperados: 0,
    consultas_general: 0,
    consultas_interna: 0,
    consultas_vacunacion: 0,
    consultas_cirugia: 0,
    pendientes: 0,
    en_gestion: 0,
    rechazados: 0,
  };

  if (!isSupabaseConfigured() || !supabase) {
    return emptyMetrics;
  }

  let query = supabase
    .from('oportunidades')
    .select('estado, servicio_interes, tipo_oportunidad, fecha_registro');

  if (dias && dias > 0) {
    const since = new Date();
    since.setDate(since.getDate() - dias);
    const sinceStr = since.toLocaleDateString('en-CA');
    query = query.gte('fecha_registro', sinceStr);
  }

  const { data: rows, error } = await query;

  if (error || !rows) {
    console.error('Error al obtener métricas:', error);
    return emptyMetrics;
  }

  const total_identificadas = rows.length;
  const pendientes = rows.filter((r) => r.estado === 'Pendiente').length;
  const en_gestion = rows.filter((r) => r.estado === 'En Gestión').length;
  const citas_generadas = rows.filter((r) => r.estado === 'Cita Agendada').length;
  const consultas_concretadas = rows.filter((r) => r.estado === 'Consulta Concretada').length;
  const rechazados = rows.filter((r) => r.estado === 'Rechazado').length;
  const total_gestionadas = rows.filter((r) => r.estado !== 'Pendiente').length;
  const pacientes_recuperados = rows.filter(
    (r) =>
      r.estado === 'Consulta Concretada' &&
      ['Inasistencia', 'Cancelación', 'Sin nueva atención registrada'].includes(r.tipo_oportunidad)
  ).length;
  const consultas_general = rows.filter(
    (r) => r.estado === 'Consulta Concretada' && r.servicio_interes === 'Medicina General'
  ).length;
  const consultas_interna = rows.filter(
    (r) => r.estado === 'Consulta Concretada' && r.servicio_interes === 'Medicina Interna'
  ).length;
  const consultas_vacunacion = rows.filter(
    (r) =>
      r.estado === 'Consulta Concretada' &&
      (r.servicio_interes === 'Vacunación & Desparasitación' ||
        r.servicio_interes.includes('Vacunaci') ||
        r.servicio_interes.includes('Desparasi'))
  ).length;
  const consultas_cirugia = rows.filter(
    (r) =>
      r.estado === 'Consulta Concretada' &&
      (r.servicio_interes === 'Cirugía/Quirófano' ||
        r.servicio_interes.includes('Cirug') ||
        r.servicio_interes.includes('Quir'))
  ).length;

  return {
    total_identificadas,
    total_gestionadas,
    citas_generadas,
    consultas_concretadas,
    pacientes_recuperados,
    consultas_general,
    consultas_interna,
    consultas_vacunacion,
    consultas_cirugia,
    pendientes,
    en_gestion,
    rechazados,
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

  return [];
}
