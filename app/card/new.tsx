import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeckStore } from '@/store/deckStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function NewCardScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { addCard, activeDeck } = useDeckStore();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [frontError, setFrontError] = useState('');
  const [backError, setBackError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const backRef = useRef<any>(null);

  const handleAdd = async () => {
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
      await addCard(deckId, { front, back, hint: hint || undefined });
      setFront('');
      setBack('');
      setHint('');
      setAddedCount((n) => n + 1);
    } finally {
      setLoading(false);
    }
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
        {activeDeck && (
          <Text style={[Typography.caption, { color: c.textSecondary }]}>
            Adding to: {activeDeck.title}
          </Text>
        )}

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
          returnKeyType="next"
          onSubmitEditing={() => backRef.current?.focus()}
        />

        <Input
          ref={backRef}
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
            label={`Add Card${addedCount > 0 ? ` (${addedCount} added)` : ''}`}
            onPress={handleAdd}
            loading={loading}
            fullWidth
          />
          <Button
            label="Done"
            onPress={() => router.back()}
            variant="secondary"
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
