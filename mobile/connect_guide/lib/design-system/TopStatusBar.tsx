import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './tokens';

interface TopStatusBarProps {
  title: string;
  leftAction?: () => void;
  rightAction?: () => void;
  leftIcon?: string; // Could be icon name for lucide-react-native
  rightIcon?: string;
  className?: string;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  title,
  leftAction,
  rightAction,
  leftIcon,
  rightIcon,
  className = ''
}) => {
  return (
    <View className={`flex items-center justify-between px-4 py-4 bg-[${colors.surface]} border-b-[${colors.border]} ${className}`}>
      <StatusBar style="light" />
      <View className="flex items-center gap-2">
        {leftIcon && <Text className="text-[${colors.primary}]">{leftIcon}</Text>}
        {leftAction && (
          <Pressable onPress={leftAction} className="opacity-70 hover:opacity-100">
            <Text className="text-[${colors.textSecondary}]">Back</Text>
          </Pressable>
        )}
        {!leftAction && !leftIcon && (
          <Text className="text-[${colors.textSecondary}] opacity-50">←</Text>
        )}
      </View>

      <View className="flex items-center gap-2">
        <Text className={`font-medium text-[${colors.textPrimary}]`}>{title}</Text>
        {rightIcon && <Text className="text-[${colors.primary}]">{rightIcon}</Text>}
        {rightAction && (
          <Pressable onPress={rightAction} className="opacity-70 hover:opacity-100">
            <Text className="text-[${colors.textSecondary}]">Action</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};