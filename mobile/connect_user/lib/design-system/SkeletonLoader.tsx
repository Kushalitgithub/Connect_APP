import React from 'react';
import { View } from 'react-native';
import { colors } from './tokens';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = 100,
  height = 10,
  className = ''
}) => {
  return (
    <View
      className={`bg-[${colors.surfaceAlt]} rounded-${'md'} w-[${typeof width === 'number' ? width + 'px' : width}] h-[${typeof height === 'number' ? height + 'px' : height}] animate-pulse ${className}`}
    />
  );
};