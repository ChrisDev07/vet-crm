'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export const MIN_PASSWORD_LENGTH = 8;

export interface AuthState {
  loading: boolean;
  session: Session | null;
  isRecovery: boolean;
}

function getConfiguredSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase no está configurado en las variables de entorno.');
  }
  return supabase;
}

function translateAuthError(message: string, context: 'login' | 'reauth' | 'default' = 'default'): string {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return context === 'reauth'
      ? 'La contraseña actual es incorrecta.'
      : 'Correo o contraseña incorrectos.';
  }
  if (lower.includes('email not confirmed')) {
    return 'El usuario no está confirmado en Supabase Auth.';
  }
  if (lower.includes('same password') || lower.includes('different from the old password')) {
    return 'La nueva contraseña debe ser diferente a la actual.';
  }
  if (lower.includes('password should be at least')) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (lower.includes('for security purposes') || lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Demasiados intentos recientes. Espera unos segundos antes de volver a intentarlo.';
  }
  if (lower.includes('auth session missing') || lower.includes('expired') || lower.includes('otp_expired')) {
    return 'El enlace o sesión de recuperación expiró o ya fue utilizado. Solicita uno nuevo.';
  }

  return message;
}

/**
 * Valida reglas básicas compartidas para actualizar contraseñas en formularios.
 */
export function validatePasswordPair(
  newPassword: string,
  confirmPassword: string,
  currentPassword?: string
): string | null {
  if (currentPassword !== undefined && !currentPassword) {
    return 'Ingresa tu contraseña actual.';
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (newPassword !== confirmPassword) {
    return 'La confirmación no coincide con la nueva contraseña.';
  }
  if (currentPassword !== undefined && newPassword === currentPassword) {
    return 'La nueva contraseña debe ser diferente a la actual.';
  }
  return null;
}

/**
 * Suscribe el estado actual de sesión autenticada en Supabase Auth.
 */
export function useAuthSession(): AuthState {
  const configured = isSupabaseConfigured() && Boolean(supabase);
  const [state, setState] = useState<AuthState>({
    loading: configured,
    session: null,
    isRecovery: false,
  });

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured() || !client) {
      return;
    }

    let mounted = true;
    const urlHasRecoveryType =
      typeof window !== 'undefined' &&
      (window.location.hash.includes('type=recovery') ||
        new URLSearchParams(window.location.search).get('type') === 'recovery');

    client.auth.getSession().then(({ data }) => {
      if (mounted) {
        setState((prev) => ({
          loading: false,
          session: data.session ?? null,
          isRecovery: prev.isRecovery || (Boolean(data.session) && urlHasRecoveryType),
        }));
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setState((prev) => ({
        loading: false,
        session: nextSession ?? null,
        isRecovery:
          event === 'PASSWORD_RECOVERY'
            ? true
            : event === 'USER_UPDATED' || event === 'SIGNED_OUT'
              ? false
              : prev.isRecovery,
      }));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Inicia sesión con correo y contraseña mediante Supabase Auth.
 */
export async function signInWithEmail(email: string, password: string) {
  const client = getConfiguredSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(translateAuthError(error.message, 'login'));
  }

  return data.session;
}

/**
 * Cambia la contraseña del usuario autenticado validando primero su contraseña actual.
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const client = getConfiguredSupabase();

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  if (currentPassword === newPassword) {
    throw new Error('La nueva contraseña debe ser diferente a la actual.');
  }

  const { data: userData, error: userError } = await client.auth.getUser();
  const userEmail = userData.user?.email;
  if (userError || !userEmail) {
    throw new Error('No se encontró una sesión activa válida. Inicia sesión nuevamente.');
  }

  const { error: reauthError } = await client.auth.signInWithPassword({
    email: userEmail,
    password: currentPassword,
  });
  if (reauthError) {
    throw new Error(translateAuthError(reauthError.message, 'reauth'));
  }

  const { error: updateError } = await client.auth.updateUser({
    password: newPassword,
  });
  if (updateError) {
    throw new Error(translateAuthError(updateError.message));
  }
}

/**
 * Envía correo de recuperación de contraseña redirigiendo a /restablecer-clave.
 */
export async function sendPasswordResetEmail(email: string) {
  const client = getConfiguredSupabase();
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    throw new Error('Ingresa el correo electrónico de la cuenta.');
  }

  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/restablecer-clave` : undefined;

  const { error } = await client.auth.resetPasswordForEmail(
    trimmedEmail,
    redirectTo ? { redirectTo } : undefined
  );

  if (error) {
    throw new Error(translateAuthError(error.message));
  }
}

/**
 * Verifica enlaces de recuperación que lleguen con token_hash por query param.
 */
export async function verifyRecoveryTokenHash(tokenHash: string) {
  const client = getConfiguredSupabase();

  const { data, error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'recovery',
  });

  if (error) {
    throw new Error(translateAuthError(error.message));
  }

  return data.session;
}

/**
 * Guarda la nueva contraseña durante un flujo de recuperación de cuenta.
 */
export async function updateRecoveredPassword(newPassword: string) {
  const client = getConfiguredSupabase();

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(translateAuthError(error.message));
  }
}

/**
 * Cierra la sesión activa en Supabase Auth.
 */
export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
