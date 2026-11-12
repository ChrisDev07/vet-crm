'use client';

import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  iconName?: string;
  helperText?: string;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete,
  required = false,
  minLength,
  disabled = false,
  iconName = 'lock',
  helperText,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
          {iconName}
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-11 py-2.5 bg-surface-container-low/80 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-inner disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          className="absolute right-3 p-1 rounded-lg text-outline hover:text-primary transition-colors disabled:opacity-50"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {helperText && (
        <span className="font-body-sm text-[11px] text-outline">{helperText}</span>
      )}
    </div>
  );
}
