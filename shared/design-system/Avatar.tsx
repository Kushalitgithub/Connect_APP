import React from 'react';
import { colors, radii } from './tokens';

interface AvatarProps {
  src?: string;
  alt?: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size,
  className = '',
  fallback
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full rounded-full bg-gray-200"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
          {fallback || (
            <span className="text-xs font-medium text-gray-600">
              {alt ? alt.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};