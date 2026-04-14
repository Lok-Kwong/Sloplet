import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const containerStyle: ViewStyle = {
    ...(fullWidth && { alignSelf: 'stretch' }),
    opacity: disabled || loading ? 0.5 : 1,
  };

  const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
    primary: { bg: c.primary, text: '#FFFFFF' },
    secondary: { bg: c.surface, text: c.primary, border: c.border },
    danger: { bg: c.danger, text: '#FFFFFF' },
    ghost: { bg: 'transparent', text: c.primary },
  };

  const vs = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderWidth: vs.border ? 1 : 0,
          borderColor: vs.border,
        },
        containerStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <Text style={[styles.label, { color: vs.text }, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  label: {
    ...Typography.bodyMedium,
  },
});
