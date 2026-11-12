'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export interface AuthState {
  loading: boolean;
  session: Session | null;
}

/**
 * Suscribe el estado actual de sesión autenticada en Supabase Auth.
 */
export function useAuthSession(): AuthState {
  const configured = isSupabaseConfigured() && Boolean(supabase);
  const [state, setState] = useState<AuthState>({
    loading: configured,
    session: null,
  });

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured() || !client) {
      return;
    }

    let mounted = true;

    client.auth.getSession().then(({ data }) => {
      if (mounted) {
        setState({ loading: false, session: data.session ?? null });
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setState({ loading: false, session: nextSession ?? null });
      }
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
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase no está configurado en las variables de entorno.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      throw new Error('El usuario no está confirmado en Supabase Auth.');
    }
    throw new Error(error.message);
  }

  return data.session;
}

/**
 * Cierra la sesión activa en Supabase Auth.
 */
export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
