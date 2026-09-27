import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from './tokens';

interface MessageBubbleProps {
  text: string;
  isSentByMe: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isSentByMe,
  className = ''
}) => {
  const bgColor = isSentByMe ? colors.primary : colors.surfaceAlt;
  const textColor = isSentByMe ? colors.surface : colors.textPrimary;
  const alignSelf = isSentByMe ? 'flex-end' : 'flex-start';

  return (
    <View className={`max-w-[80%] rounded-${radii.lg} px-4 py-2 my-1 ${bgColor} ${textColor} align-self-${alignSelf} ${className}`}>
      <Text>{text}</Text>
    </View>
  );
};