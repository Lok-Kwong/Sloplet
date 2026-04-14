import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Deck } from '@/types';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { formatRelativeDate } from '@/utils/date';
import { useColorScheme } from 'react-native';

interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
  onLongPress: () => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onPress, onLongPress }) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
    >
      {/* Color stripe */}
      <View style={[styles.stripe, { backgroundColor: deck.color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.textPrimary }]} numberOfLines={1}>
            {deck.title}
          </Text>
          <View style={[styles.langBadge, { backgroundColor: c.border }]}>
            <Text style={[styles.langText, { color: c.textSecondary }]}>
              {deck.language}
            </Text>
          </View>
        </View>

        {deck.description ? (
          <Text
            style={[styles.description, { color: c.textSecondary }]}
            numberOfLines={2}
          >
            {deck.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={[styles.countBadge, { backgroundColor: deck.color + '20' }]}>
            <Text style={[styles.countText, { color: deck.color }]}>
              {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
            </Text>
          </View>
          <Text style={[styles.date, { color: c.textTertiary }]}>
            {formatRelativeDate(deck.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  stripe: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    flex: 1,
  },
  langBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  langText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  description: {
    ...Typography.body,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  countText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  date: {
    ...Typography.caption,
  },
});
