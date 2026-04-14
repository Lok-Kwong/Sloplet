import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
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
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function EditDeckScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeDeck, editDeck, removeDeck } = useDeckStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [color, setColor] = useState(Colors.deckColors[0]);
  const [titleError, setTitleError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeDeck && activeDeck.id === id) {
      setTitle(activeDeck.title);
      setDescription(activeDeck.description);
      setLanguage(activeDeck.language);
      setColor(activeDeck.color);
    }
  }, [activeDeck, id]);

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Deck title is required');
      return;
    }
    setTitleError('');
    setLoading(true);
    try {
      await editDeck(id, { title, description, language: language || 'en', color });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Deck',
      `Delete "${title}" and all its cards? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeDeck(id);
            router.dismissAll();
          },
        },
      ]
    );
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
          label="Title *"
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            if (t.trim()) setTitleError('');
          }}
          placeholder="e.g. HSK Level 1 Vocabulary"
          error={titleError}
          maxLength={80}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Optional description..."
          multiline
          maxLength={300}
        />

        <Input
          label="Language"
          value={language}
          onChangeText={setLanguage}
          placeholder="e.g. en, zh-Hans, ja, ko"
          maxLength={20}
        />

        <View style={styles.colorSection}>
          <Text style={[Typography.label, { color: c.textSecondary }]}>Color</Text>
          <View style={styles.colorRow}>
            {Colors.deckColors.map((hex) => (
              <TouchableOpacity
                key={hex}
                onPress={() => setColor(hex)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: hex },
                  color === hex && styles.colorSwatchSelected,
                ]}
              >
                {color === hex && (
                  <Text style={styles.colorCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          label="Save Changes"
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={styles.saveButton}
        />

        <Button
          label="Delete Deck"
          onPress={handleDelete}
          variant="danger"
          fullWidth
        />
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
  colorSection: {
    gap: Spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  colorCheck: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  saveButton: {},
});
