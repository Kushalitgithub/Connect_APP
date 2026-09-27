import React from 'react';
import { View } from 'react-native';
import { colors } from './tokens';

interface RatingStarsProps {
  rating: number; // 0-5
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STAR_ICON = '★';

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
  className = ''
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View className={`flex gap-1 ${sizeMap[size]} ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <Text key={index} className={`text-[${colors.star}]`}>
          {STAR_ICON}
        </Text>
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <Text className={`text-[${colors.star}]`}>
          {STAR_ICON}
        </Text>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <Text key={index} className={`text-[${colors.border}]`}>
          {STAR_ICON}
        </Text>
      ))}
    </View>
  );
};