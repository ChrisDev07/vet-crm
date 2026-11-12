'use client';

import { useSyncExternalStore } from 'react';

export type ShiftType = 'mañana' | 'tarde';

export const SHIFT_STORAGE_KEY = 'medivet_shift';
const SHIFT_CHANGE_EVENT = 'medivet-shift-change';

const SHIFT_META: Record<ShiftType, { label: string; hours: string; icon: string }> = {
  mañana: {
    label: 'Turno Mañana',
    hours: '08:00 AM - 02:00 PM',
    icon: 'wb_sunny',
  },
  tarde: {
    label: 'Turno Tarde',
    hours: '02:00 PM - 08:00 PM',
    icon: 'mode_night',
  },
};

function getShiftSnapshot(): ShiftType | null | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = localStorage.getItem(SHIFT_STORAGE_KEY);
  return value === 'mañana' || value === 'tarde' ? value : null;
}

function getServerShiftSnapshot(): ShiftType | null | undefined {
  return undefined;
}

function subscribeShift(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(SHIFT_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(SHIFT_CHANGE_EVENT, handler);
  };
}

/**
 * Suscribe de forma segura el turno activo guardado en localStorage sin causar desajustes de hidratación.
 */
export function useActiveShift(): ShiftType | null | undefined {
  return useSyncExternalStore(subscribeShift, getShiftSnapshot, getServerShiftSnapshot);
}

/**
 * Guarda el turno activo y notifica a los componentes suscritos en la misma pestaña.
 */
export function setActiveShift(shift: ShiftType) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHIFT_STORAGE_KEY, shift);
  window.dispatchEvent(new Event(SHIFT_CHANGE_EVENT));
}

/**
 * Cierra el turno activo y notifica a los componentes suscritos.
 */
export function clearActiveShift() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SHIFT_STORAGE_KEY);
  window.dispatchEvent(new Event(SHIFT_CHANGE_EVENT));
}

/**
 * Devuelve etiqueta, horario e ícono para mostrar el turno activo en la interfaz.
 */
export function getShiftMetadata(shift: ShiftType | null | undefined) {
  if (shift && shift in SHIFT_META) {
    return SHIFT_META[shift];
  }
  return {
    label: 'Turno Activo',
    hours: 'Recepción clínica',
    icon: 'clinical_notes',
  };
}
