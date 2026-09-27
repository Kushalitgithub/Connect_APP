import React from 'react';
import { colors } from './tokens';

interface StatusChipProps {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  children: React.ReactNode;
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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        bg-[${bgColor}] text-[${textColor]} ${className}`}
    >
      {children}
    </span>
  );
};