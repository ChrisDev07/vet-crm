'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/components/PasswordInput';
import {
  MIN_PASSWORD_LENGTH,
  updateRecoveredPassword,
  useAuthSession,
  validatePasswordPair,
  verifyRecoveryTokenHash,
} from '@/lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { loading, session } = useAuthSession();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function inspectRecoveryUrl() {
      if (typeof window === 'undefined') return;

      const searchParams = new URLSearchParams(window.location.search);
      const hashRaw = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hashRaw);

      const urlError =
        hashParams.get('error_description') ||
        hashParams.get('error') ||
        searchParams.get('error_description') ||
        searchParams.get('error');

      if (urlError) {
        if (active) {
          setErrorMsg('El enlace de recuperación expiró o no es válido. Solicita uno nuevo.');
          setIsVerifyingLink(false);
        }
        return;
      }

      const tokenHash = searchParams.get('token_hash');
      const linkType = searchParams.get('type');
      if (tokenHash && linkType === 'recovery') {
        try {
          await verifyRecoveryTokenHash(tokenHash);
        } catch (err: unknown) {
          if (active) {
            setErrorMsg(
              err instanceof Error
                ? err.message
                : 'No fue posible validar el enlace de recuperación.'
            );
          }
        }
      }

      if (active) {
        setIsVerifyingLink(false);
      }
    }

    void inspectRecoveryUrl();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validatePasswordPair(newPassword, confirmPassword);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateRecoveredPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'No fue posible guardar la nueva contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChecking = loading || isVerifyingLink;
  const canReset = Boolean(session) && !isSuccess;

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-secondary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[36px]">lock_reset</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight mb-1">
              Nueva contraseña
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Configura tu nueva clave de acceso para MEDIVET CRM.
            </p>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-container-low flex flex-col gap-5">
          {isChecking ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Validando enlace de recuperación...
              </span>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-4 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-md text-label-md flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px] shrink-0">check_circle</span>
                <span>Contraseña actualizada correctamente.</span>
              </div>
              <button
                type="button"
                onClick={() => router.replace('/')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-md hover:brightness-105 transition-all"
              >
                Entrar al CRM
              </button>
            </div>
          ) : canReset ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <PasswordInput
                id="reset-new-password"
                label="Nueva contraseña"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                disabled={isSubmitting}
                iconName="lock_reset"
                helperText={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
              />

              <PasswordInput
                id="reset-confirm-password"
                label="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                disabled={isSubmitting}
                iconName="verified"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña'}</span>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>
                  {errorMsg ||
                    'No hay una solicitud de recuperación activa. Solicita un nuevo enlace desde el inicio de sesión.'}
                </span>
              </div>
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold text-center shadow-sm hover:bg-primary-container transition-all"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
