import React from 'react';
import { View } from 'react-native';
import { colors } from './tokens';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <View
      className={`rounded-full bg-[${colors.primary]} ${sizeMap[size]} ${className}`}
    />
  );
};