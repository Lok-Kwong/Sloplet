import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Flashcard } from '@/types';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useColorScheme } from 'react-native';

interface CardListItemProps {
  card: Flashcard;
  onPress: () => void;
  onDelete: () => void;
}

export const CardListItem: React.FC<CardListItemProps> = ({
  card,
  onPress,
  onDelete,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const confirmDelete = () => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={confirmDelete}
      activeOpacity={0.8}
      style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}
    >
      <View style={styles.col}>
        <Text style={[styles.colLabel, { color: c.textTertiary }]}>Front</Text>
        <Text style={[styles.colText, { color: c.textPrimary }]} numberOfLines={2}>
          {card.front}
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: c.border }]} />
      <View style={styles.col}>
        <Text style={[styles.colLabel, { color: c.textTertiary }]}>Back</Text>
        <Text style={[styles.colText, { color: c.textSecondary }]} numberOfLines={2}>
          {card.back}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  col: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  colLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colText: {
    ...Typography.body,
  },
  divider: {
    width: 1,
  },
});
