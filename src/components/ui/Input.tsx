import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, multiline, style, ...rest }, ref) => {
    const scheme = useColorScheme() ?? 'light';
    const c = Colors[scheme];

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>
        ) : null}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            multiline && styles.multiline,
            {
              backgroundColor: c.surface,
              color: c.textPrimary,
              borderColor: error ? c.danger : c.border,
            },
            style,
          ]}
          placeholderTextColor={c.textTertiary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCorrect={false}
          autoCapitalize="none"
          {...rest}
        />
        {error ? (
          <Text style={[styles.error, { color: c.danger }]}>{error}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.label,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    ...Typography.body,
    minHeight: 48,
  },
  multiline: {
    minHeight: 100,
    paddingTop: Spacing.sm + 2,
  },
  error: {
    ...Typography.caption,
  },
});
