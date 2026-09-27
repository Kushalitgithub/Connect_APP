import React from 'react';
import { colors } from './tokens';

interface RatingStarsProps {
  rating: number; // 0 to 5
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  className = '',
  size = 'md'
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const stars = [];

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className={`${sizeMap[size]} inline-block`}>
      {/* Using SVG for star shape */}
      <svg viewBox="0 0 24 24" fill={colors.star} aria-hidden="true">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.928 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.928 8.332-1.151z"/>
      </svg>
    </span>);
  }

  // Half star
  if (halfStar) {
    stars.push(<span key="half" className={`${sizeMap[size]} inline-block`}>
      <svg viewBox="0 0 24 24" fill={colors.star} aria-hidden="true">
        <path d="M11.054.587l3.668 7.568 8.332 1.151-6.064 5.928 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.928 8.332-1.151z"/>
      </svg>
    </span>);
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className={`${sizeMap[size]} inline-block text-muted`}>
      <svg viewBox="0 0 24 24" fill="none" stroke={colors.border} strokeWidth={2} aria-hidden="true">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.928 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.928 8.332-1.151z"/>
      </svg>
    </span>);
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {stars}
    </div>
  );
};