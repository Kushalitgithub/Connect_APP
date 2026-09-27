import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, radii } from './tokens';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onPress,
  disabled = false
}) => {
  const base = `flex items-center justify-center gap-2 text-sm font-medium
    transition-all duration-200 transform
    disabled:opacity-50 disabled:pointer-events-none
    rounded-${radii[size]}
    `;

  const variantMap: Record<string, string> = {
    primary: `bg-[${colors.primary}] text-[${colors.surface}] hover:bg-[${colors.primaryLight}] active:bg-[${colors.primaryDark}]`,
    secondary: `bg-[${colors.surface}] text-[${colors.textPrimary}] border border-[${colors.border}] hover:bg-[${colors.surfaceAlt}] active:bg-[${colors.border}]`,
    accent: `bg-[${colors.accent}] text-[${colors.surface}] hover:bg-[${colors.accentLight}] active:bg-[${colors.accentDark}]`,
  };

  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${base} ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </Pressable>
  );
};