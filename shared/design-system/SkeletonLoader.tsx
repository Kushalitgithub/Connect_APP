import React from 'react';
import { colors } from './tokens';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  radius?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  radius = 'md'
}) => {
  // Convert radius to Tailwind radius class
  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  const radiusClass = radiusMap[radius] || 'rounded-md';

  return (
    <div
      className={`animate-pulse bg-gray-200 ${radiusClass} ${className}`}
      style={{ width, height }}
    />
  );
};