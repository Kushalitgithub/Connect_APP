import React from 'react';
import { View } from 'react-native';
import { colors, radii } from './tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = ''
}) => {
  return (
    <View
      className={`bg-[${colors.surface]} rounded-${radii.md} shadow-sm ${className}`}
    >
      {children}
    </View>
  );
};