import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { BorderRadius } from '@/constants/spacing';
import { useColorScheme } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  color,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: c.border, borderRadius: height / 2 },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            height,
            backgroundColor: color ?? c.primary,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {},
});
