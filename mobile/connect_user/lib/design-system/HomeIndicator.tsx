import React from 'react';
import { View } from 'react-native';
import { colors } from './tokens';

export const HomeIndicator: React.FC<{ className?: string }> = ({
  className = ''
}) => {
  return (
    <View className={`fixed bottom-0 left-0 right-0 h-4 bg-[${colors.surface]}/50 backdrop-blur
      border-t-[${colors.border]} ${className}`} />
  );
};