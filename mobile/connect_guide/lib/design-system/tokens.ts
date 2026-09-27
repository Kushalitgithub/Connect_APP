// Design tokens for Connect app
// Based on Connect_Frontend_Spec.md

export const colors = {
  // Primary
  primary: '#F54900',
  primaryLight: '#FF6B2B',
  primaryDark: '#C23900',
  // Accent
  accent: '#F4A261',
  accentLight: '#F7BC8A',
  accentDark: '#E08040',
  // Backgrounds
  background: '#F7F5F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EDE6',
  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#4A5568',
  textMuted: '#9AA3B2',
  // Border
  border: '#E8E4DC',
  // Feedback
  error: '#E05252',
  pending: '#F59E0B',
  star: '#FBBF24',
  // Status chip backgrounds
  statusChip: {
    pending: '#FEF3C7',
    accepted: '#D1FAE5',
    rejected: '#FEE2E2',
    completed: '#E0F2FE',
    cancelled: '#F3F4F6',
  },
  // Status chip text colors
  statusChipText: {
    pending: '#92400E',
    accepted: '#065F46',
    rejected: '#991B1B',
    completed: '#0369A1',
    cancelled: '#6B7280',
  },
};

export const typography = {
  sans: "'Outfit', system-ui, sans-serif",
  serif: "'DM Serif Display', Georgia, serif",
};

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};