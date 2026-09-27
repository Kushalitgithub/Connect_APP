import React from 'react';
import { View, TextInput } from 'react-native';
import { colors, radii } from './tokens';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  className = ''
}) => {
  return (
    <View className={`flex-1 border border-[${colors.border]} rounded-${radii.md} bg-[${colors.surface]} px-4 py-2 focus:border-[${colors.primary}] focus:outline-none ${className}`}>
      <TextInput
        placeholder={placeholder}
        value={value || ''}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={{ flex: 1, fontSize: 16 }}
      />
    </View>
  );
};