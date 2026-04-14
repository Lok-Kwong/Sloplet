import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { useSettingsStore } from '@/store/settingsStore';
import { FlashCard } from '@/components/FlashCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function StudyScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { id } = useLocalSearchParams<{ id: string }>();

  const { activeDeck, activeCards, loadDeck } = useDeckStore();
  const { session, startSession, markKnown, markUnknown, nextCard, resetSession } =
    useStudyStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (id) loadDeck(id);
  }, [id]);

  useEffect(() => {
    if (activeDeck && activeCards.length > 0 && !session) {
      startSession(activeDeck, activeCards, settings.studyShuffled);
    }
  }, [activeDeck, activeCards]);

  if (!session || !activeDeck) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Text style={[Typography.body, { color: c.textSecondary, textAlign: 'center' }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // ─── Session complete screen ──────────────────────────────────────────────
  if (session.status === 'complete') {
    const total = session.cards.length;
    const knownCount = session.knownIds.length;
    const unknownCount = session.unknownIds.length;
    const unanswered = total - knownCount - unknownCount;
    const pct = total > 0 ? Math.round((knownCount / total) * 100) : 0;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={[Typography.h1, { color: c.textPrimary, textAlign: 'center' }]}>
            Session Complete!
          </Text>
          <Text style={[Typography.body, { color: c.textSecondary, textAlign: 'center' }]}>
            {activeDeck.title}
          </Text>

          <View style={[styles.statsCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <StatRow label="Got it" value={knownCount} color={c.success} />
            <StatRow label="Still learning" value={unknownCount} color={c.warning} />
            {unanswered > 0 && (
              <StatRow label="Skipped" value={unanswered} color={c.textTertiary} />
            )}
            <View style={[styles.statDivider, { backgroundColor: c.border }]} />
            <StatRow label="Score" value={`${pct}%`} color={c.primary} bold />
          </View>

          <View style={styles.completeActions}>
            <Button
              label="Study Again"
              onPress={() => resetSession()}
              fullWidth
            />
            <Button
              label="Back to Deck"
              onPress={() => {
                useStudyStore.getState().endSession();
                router.back();
              }}
              variant="secondary"
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Active study card ────────────────────────────────────────────────────
  const currentCard = session.cards[session.currentIndex];
  const total = session.cards.length;
  const progress = (session.currentIndex) / total;

  const handleGotIt = () => {
    markKnown(currentCard.id);
    nextCard();
  };

  const handleStillLearning = () => {
    markUnknown(currentCard.id);
    nextCard();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={[Typography.caption, { color: c.textSecondary }]}>
          {session.currentIndex + 1} / {total}
        </Text>
        <ProgressBar progress={progress} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Text style={[Typography.caption, { color: c.success }]}>
          ✓ {session.knownIds.length}
        </Text>
        <Text style={[Typography.caption, { color: c.textSecondary }]}>
          {activeDeck.title}
        </Text>
        <Text style={[Typography.caption, { color: c.warning }]}>
          ✗ {session.unknownIds.length}
        </Text>
      </View>

      {/* Flash Card */}
      <View style={styles.cardSection}>
        <FlashCard
          front={currentCard.front}
          back={currentCard.back}
          hint={currentCard.hint}
          accentColor={activeDeck.color}
          resetOnChange
        />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          label="Still Learning"
          onPress={handleStillLearning}
          variant="secondary"
          style={StyleSheet.flatten([styles.actionBtn, { borderColor: c.warning }])}
          textStyle={{ color: c.warning }}
        />
        <Button
          label="Got It!"
          onPress={handleGotIt}
          style={StyleSheet.flatten([styles.actionBtn, { backgroundColor: c.success }])}
        />
      </View>

      <Button
        label="End Session"
        onPress={() => {
          useStudyStore.getState().endSession();
        }}
        variant="ghost"
        style={styles.endBtn}
      />
    </SafeAreaView>
  );
}

function StatRow({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: number | string;
  color: string;
  bold?: boolean;
}) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  return (
    <View style={statStyles.row}>
      <Text
        style={[
          Typography.body,
          { color: c.textSecondary },
          bold && { fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          Typography.bodyMedium,
          { color },
          bold && { fontWeight: '700', fontSize: 18 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressSection: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
  endBtn: {
    marginBottom: Spacing.sm,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  completeEmoji: {
    fontSize: 64,
  },
  statsCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  statDivider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  completeActions: {
    width: '100%',
    gap: Spacing.sm,
  },
});
