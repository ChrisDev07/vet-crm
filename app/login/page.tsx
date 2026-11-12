'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, useAuthSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { loading, session } = useAuthSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!loading && session) {
      router.replace('/');
    }
  }, [loading, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'No fue posible iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-secondary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[36px]">pets</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight mb-1">
              MEDIVET <span className="text-primary">CRM</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Inicia sesión para acceder a la gestión clínica de oportunidades.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-container-low flex flex-col gap-5"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="login-email">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
                mail
              </span>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recepcion@medivet.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/80 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="login-password">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
                lock
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-surface-container-low/80 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 p-1 rounded-lg text-outline hover:text-primary transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
          >
            <span>{isSubmitting ? 'Verificando acceso...' : 'Iniciar sesión'}</span>
            <span className="material-symbols-outlined text-[20px]">
              {isSubmitting ? 'sync' : 'login'}
            </span>
          </button>
        </form>

        {/* Footer info */}
        <p className="font-label-sm text-label-sm text-outline text-center flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">shield_lock</span>
          Acceso protegido mediante Supabase Authentication
        </p>
      </div>
    </main>
  );
}
