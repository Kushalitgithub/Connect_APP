import React from 'react';
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
    <div
      className={`relative overflow-hidden bg-[${colors.surface}] backdrop-blur-sm
        border border-[${colors.border]} shadow-sm rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};