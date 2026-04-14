import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeckStore } from '@/store/deckStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function EditCardScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { id: cardId, deckId } = useLocalSearchParams<{ id: string; deckId: string }>();
  const { activeCards, editCard, removeCard } = useDeckStore();

  const card = activeCards.find((c) => c.id === cardId);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [frontError, setFrontError] = useState('');
  const [backError, setBackError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
      setHint(card.hint ?? '');
    }
  }, [card]);

  const handleSave = async () => {
    let hasError = false;
    if (!front.trim()) {
      setFrontError('Front text is required');
      hasError = true;
    }
    if (!back.trim()) {
      setBackError('Back text is required');
      hasError = true;
    }
    if (hasError) return;

    setFrontError('');
    setBackError('');
    setLoading(true);
    try {
      await editCard(deckId, cardId, { front, back, hint: hint || undefined });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Card', 'Delete this card? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeCard(deckId, cardId);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: c.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Front (Definition) *"
          value={front}
          onChangeText={(t) => {
            setFront(t);
            if (t.trim()) setFrontError('');
          }}
          placeholder="e.g. 你好 or 'to run'"
          error={frontError}
          multiline
          maxLength={500}
        />

        <Input
          label="Back (Answer) *"
          value={back}
          onChangeText={(t) => {
            setBack(t);
            if (t.trim()) setBackError('');
          }}
          placeholder="e.g. Hello / nǐ hǎo"
          error={backError}
          multiline
          maxLength={500}
        />

        <Input
          label="Hint (Optional)"
          value={hint}
          onChangeText={setHint}
          placeholder="Optional hint shown before flipping..."
          maxLength={200}
        />

        <View style={styles.actions}>
          <Button
            label="Save Changes"
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
          <Button
            label="Delete Card"
            onPress={handleDelete}
            variant="danger"
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
