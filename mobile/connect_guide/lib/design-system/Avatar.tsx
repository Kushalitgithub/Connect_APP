import React from 'react';
import { View, Image, Text } from 'react-native';
import { colors, radii } from './tokens';

interface AvatarProps {
  source?: { uri: string }; // For network images
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  placeholder?: string; // Initials or fallback text
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'md',
  radius = 'md',
  placeholder,
  className = ''
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const radiusMap: Record<string, string> = {
    sm: `rounded-${radii.sm}`,
    md: `rounded-${radii.md}`,
    lg: `rounded-${radii.lg}`,
    xl: `rounded-${radii.xl}`,
    full: 'rounded-full'
  };

  return (
    <View
      className={`${sizeMap[size]} ${radiusMap[radius]} overflow-hidden ${className}`}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <View className={`flex items-center justify-center bg-[${colors.primary]} text-[${colors.surface}] w-full h-full`}>
          <Text className="text-xs font-medium">{placeholder?.toUpperCase() || '?'}</Text>
        </View>
      )}
    </View>
  );
};