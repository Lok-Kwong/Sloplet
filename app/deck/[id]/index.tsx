import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useDeckStore } from '@/store/deckStore';
import { CardListItem } from '@/components/CardListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Flashcard } from '@/types';

export default function DeckDetailScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { activeDeck, activeCards, isLoadingDeck, loadDeck, removeCard } = useDeckStore();

  useEffect(() => {
    if (id) loadDeck(id);
  }, [id]);

  useEffect(() => {
    if (activeDeck) {
      navigation.setOptions({ title: activeDeck.title });
    }
  }, [activeDeck]);

  const handleEditCard = useCallback(
    (card: Flashcard) => {
      router.push({ pathname: '/card/[id]/edit', params: { id: card.id, deckId: id } });
    },
    [id]
  );

  const handleDeleteCard = useCallback(
    (card: Flashcard) => {
      removeCard(id, card.id);
    },
    [id, removeCard]
  );

  if (!activeDeck && !isLoadingDeck) return null;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Deck header */}
      {activeDeck && (
        <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
          <View style={[styles.colorDot, { backgroundColor: activeDeck.color }]} />
          <View style={styles.headerMeta}>
            <Text style={[Typography.caption, { color: c.textSecondary }]}>
              {activeDeck.cardCount} {activeDeck.cardCount === 1 ? 'card' : 'cards'}
              {activeDeck.language ? ` · ${activeDeck.language}` : ''}
            </Text>
            {activeDeck.description ? (
              <Text style={[Typography.body, { color: c.textSecondary }]} numberOfLines={2}>
                {activeDeck.description}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/deck/${id}/edit`)}
            style={styles.editBtn}
          >
            <Text style={[Typography.label, { color: c.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Study button */}
      {activeDeck && activeDeck.cardCount > 0 && (
        <View style={[styles.studyBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
          <Button
            label="Study Deck"
            onPress={() => router.push(`/deck/${id}/study`)}
            fullWidth
            style={styles.studyButton}
          />
        </View>
      )}

      {/* Card list */}
      <FlatList
        data={activeCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardListItem
            card={item}
            onPress={() => handleEditCard(item)}
            onDelete={() => handleDeleteCard(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoadingDeck ? (
            <EmptyState
              title="No cards yet"
              subtitle="Add your first flashcard to this deck"
              actionLabel="Add Card"
              onAction={() => router.push({ pathname: '/card/new', params: { deckId: id } })}
            />
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.primary }]}
        onPress={() => router.push({ pathname: '/card/new', params: { deckId: id } })}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  headerMeta: {
    flex: 1,
    gap: 2,
  },
  editBtn: {
    padding: Spacing.xs,
  },
  studyBar: {
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  studyButton: {},
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.xl,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
  },
});
