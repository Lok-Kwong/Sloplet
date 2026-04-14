import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { useDeckStore } from '@/store/deckStore';
import { DeckCard } from '@/components/DeckCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Deck } from '@/types';

export default function DecksScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { decks, isLoadingDecks, loadDecks, removeDeck } = useDeckStore();

  useEffect(() => {
    loadDecks();
  }, []);

  const handleDeckPress = useCallback((deck: Deck) => {
    router.push(`/deck/${deck.id}`);
  }, []);

  const handleDeckLongPress = useCallback(
    (deck: Deck) => {
      Alert.alert(deck.title, undefined, [
        {
          text: 'Edit',
          onPress: () => router.push(`/deck/${deck.id}/edit`),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Deck',
              `Delete "${deck.title}" and all its cards? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => removeDeck(deck.id),
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [removeDeck]
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeckCard
            deck={item}
            onPress={() => handleDeckPress(item)}
            onLongPress={() => handleDeckLongPress(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoadingDecks ? (
            <EmptyState
              title="No decks yet"
              subtitle="Create your first deck to start studying"
              actionLabel="Create Deck"
              onAction={() => router.push('/deck/new')}
            />
          ) : null
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.primary }]}
        onPress={() => router.push('/deck/new')}
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
  list: {
    padding: Spacing.md,
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
