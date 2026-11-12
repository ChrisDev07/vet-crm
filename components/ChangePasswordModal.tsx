'use client';

import { useEffect, useState } from 'react';
import PasswordInput from '@/components/PasswordInput';
import { changePassword, MIN_PASSWORD_LENGTH, validatePasswordPair } from '@/lib/auth';

interface ChangePasswordModalProps {
  onClose: () => void;
  userEmail?: string;
}

export default function ChangePasswordModal({ onClose, userEmail }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validatePasswordPair(newPassword, confirmPassword, currentPassword);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Tu contraseña se actualizó correctamente.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'No fue posible cambiar la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-surface-container flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">key</span>
            </div>
            <div className="min-w-0">
              <h3 id="change-password-title" className="font-headline-md text-headline-md font-bold text-on-surface">
                Cambiar contraseña
              </h3>
              {userEmail && (
                <p className="font-body-sm text-[12px] text-outline truncate" title={userEmail}>
                  Cuenta: {userEmail}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
            aria-label="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-md text-label-md flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] shrink-0">check_circle</span>
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm hover:bg-primary-container transition-all"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PasswordInput
              id="current-password"
              label="Contraseña actual"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />

            <PasswordInput
              id="new-password"
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
              id="confirm-new-password"
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              disabled={isSubmitting}
              iconName="verified"
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
