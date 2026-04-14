import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const CARD_HEIGHT = CARD_WIDTH * 0.65;

interface FlashCardProps {
  front: string;
  back: string;
  hint?: string;
  accentColor?: string;
  onFlip?: (isFlipped: boolean) => void;
  // If true, card resets to front when front/back props change
  resetOnChange?: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  front,
  back,
  hint,
  accentColor,
  onFlip,
  resetOnChange = true,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const flipValue = useSharedValue(0); // 0 = front, 1 = back

  // Reset flip when card content changes (next card in study mode)
  const prevFront = React.useRef(front);
  if (resetOnChange && prevFront.current !== front) {
    prevFront.current = front;
    flipValue.value = 0;
  }

  const handleFlip = () => {
    const toValue = flipValue.value === 0 ? 1 : 0;
    flipValue.value = withTiming(toValue, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
    onFlip?.(toValue === 1);
  };

  // Front face: rotates from 0° to 90° (disappears at midpoint)
  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 0.5], [0, 90]);
    const opacity = interpolate(flipValue.value, [0, 0.45, 0.5], [1, 1, 0]);
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // Back face: rotates from -90° to 0° (appears at midpoint)
  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0.5, 1], [-90, 0]);
    const opacity = interpolate(flipValue.value, [0.5, 0.55, 1], [0, 1, 1]);
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const cardAccent = accentColor ?? c.primary;

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View style={styles.container}>
        {/* Front Face */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: c.surface, borderColor: c.border },
            styles.absolute,
            frontStyle,
          ]}
        >
          <View style={[styles.accentBar, { backgroundColor: cardAccent }]} />
          <View style={styles.cardContent}>
            <Text style={[styles.faceLabel, { color: c.textTertiary }]}>Definition</Text>
            <Text
              style={[styles.frontText, { color: c.textPrimary }]}
              adjustsFontSizeToFit
              numberOfLines={6}
            >
              {front}
            </Text>
            {hint ? (
              <Text style={[styles.hint, { color: c.textSecondary }]}>
                Hint: {hint}
              </Text>
            ) : null}
          </View>
          <Text style={[styles.tapHint, { color: c.textTertiary }]}>Tap to flip</Text>
        </Animated.View>

        {/* Back Face */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: cardAccent + '15',
              borderColor: cardAccent + '40',
            },
            styles.absolute,
            backStyle,
          ]}
        >
          <View style={[styles.accentBar, { backgroundColor: cardAccent }]} />
          <View style={styles.cardContent}>
            <Text style={[styles.faceLabel, { color: cardAccent }]}>Answer</Text>
            <Text
              style={[styles.backText, { color: c.textPrimary }]}
              adjustsFontSizeToFit
              numberOfLines={6}
            >
              {back}
            </Text>
          </View>
          <Text style={[styles.tapHint, { color: c.textTertiary }]}>Tap to flip back</Text>
        </Animated.View>

        {/* Transparent placeholder to reserve layout space */}
        <View style={[styles.card, { opacity: 0 }]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  accentBar: {
    height: 5,
    width: '100%',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  faceLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  frontText: {
    ...Typography.flashcardFront,
    textAlign: 'center',
    flexShrink: 1,
  },
  backText: {
    ...Typography.flashcardBack,
    textAlign: 'center',
    flexShrink: 1,
  },
  hint: {
    ...Typography.caption,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tapHint: {
    ...Typography.caption,
    textAlign: 'center',
    paddingBottom: Spacing.sm,
  },
});
