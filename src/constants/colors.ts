export const Colors = {
  light: {
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#60A5FA',
    primaryDark: '#3B82F6',
    background: '#111827',
    surface: '#1F2937',
    border: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  // Preset colors for deck visual identity
  deckColors: [
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#64748B', // slate
  ],
};

export type ColorScheme = 'light' | 'dark';
