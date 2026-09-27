import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { colors } from './tokens';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  className = ''
}) => {
  return (
    <View className={`fixed bottom-0 left-0 right-0 flex flex-row items-center justify-around
      bg-[${colors.surface}]/80 backdrop-blur-sm border-t-[${colors.border]}
      px-4 py-3 shadow-md z-50 ${className}`}>
      <Link href="/" className="flex items-center gap-1 text-[${colors.textSecondary}] hover:text-[${colors.primary}]">
        <Text>🏠</Text>
        <Text>Home</Text>
      </Link>

      <Link href="/find" className="flex items-center gap-1 text-[${colors.textSecondary}] hover:text-[${colors.primary}]">
        <Text>🔍</Text>
        <Text>Find</Text>
      </Link>

      <Link href="/bookings" className="flex items-center gap-1 text-[${colors.textSecondary}] hover:text-[${colors.primary}]">
        <Text>📋</Text>
        <Text>Bookings</Text>
      </Link>

      <Link href="/inbox" className="flex items-center gap-1 text-[${colors.textSecondary}] hover:text-[${colors.primary}]">
        <Text>💬</Text>
        <Text>Inbox</Text>
      </Link>
    </View>
  );
};