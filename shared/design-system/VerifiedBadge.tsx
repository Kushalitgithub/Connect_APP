import React from 'react';
import { colors } from './tokens';

interface VerifiedBadgeProps {
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        bg-[${colors.accentLight}] text-[${colors.accentDark]} ${className}`}
    >
      Verified
    </span>
  );
};