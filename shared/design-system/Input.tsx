import React from 'react';
import { colors, radii } from './tokens';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-${radii.md} border border-[${colors.border}]
        bg-[${colors.surface}] backdrop-blur-sm px-4 py-2 text-[${colors.textPrimary}]
        focus:outline-none focus:ring-2 focus:ring-[${colors.primary}] focus:border-transparent
        disabled:opacity-50 disabled:pointer-events-none
        ${className}`}
      disabled={disabled}
    />
  );
};