import React from 'react';
import { colors, radii } from './tokens';

interface MessageBubbleProps {
  children: React.ReactNode;
  variant: 'sent' | 'received';
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  children,
  variant,
  className = ''
}) => {
  const base = `flex max-w-[80%] break-words rounded-[${radii.lg}] px-4 py-2
    `;

  const variantMap: Record<string, string> = {
    sent: `ml-auto bg-[${colors.primary}] text-[${colors.surface}]`,
    received: `mr-auto bg-[${colors.surfaceAlt}] text-[${colors.textPrimary}] border border-[${colors.border}]`,
  };

  return (
    <div className={`${base} ${variantMap[variant]} ${className}`}>
      {children}
    </div>
  );
};