import React from 'react';
import { View, Text } from 'react-native';
import { colors } from './tokens';

interface StatusChipProps {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  children?: React.ReactNode;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  children,
  className = ''
}) => {
  const bgColor = colors.statusChip[status];
  const textColor = colors.statusChipText[status];

  return (
    <View
      className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}
    >
      {children || status.toUpperCase()}
    </View>
  );
};