import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useDeckStore } from '@/store/deckStore';
import { storageClearAll } from '@/db/storage';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { settings, updateSettings } = useSettingsStore();
  const { loadDecks } = useDeckStore();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all decks and cards permanently. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await storageClearAll();
            await loadDecks();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Study section */}
      <Text style={[styles.sectionHeader, { color: c.textTertiary }]}>STUDY</Text>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <SettingRow
          label="Shuffle Cards"
          subtitle="Randomize card order in study mode"
          value={settings.studyShuffled}
          onToggle={(val) => updateSettings({ studyShuffled: val })}
          tintColor={c.primary}
        />
        <View style={[styles.separator, { backgroundColor: c.border }]} />
        <SettingRow
          label="Haptic Feedback"
          subtitle="Vibrate on card interactions"
          value={settings.hapticFeedback}
          onToggle={(val) => updateSettings({ hapticFeedback: val })}
          tintColor={c.primary}
        />
      </View>

      {/* About section */}
      <Text style={[styles.sectionHeader, { color: c.textTertiary }]}>ABOUT</Text>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.row}>
          <Text style={[Typography.body, { color: c.textPrimary }]}>App</Text>
          <Text style={[Typography.body, { color: c.textSecondary }]}>Sloplet</Text>
        </View>
        <View style={[styles.separator, { backgroundColor: c.border }]} />
        <View style={styles.row}>
          <Text style={[Typography.body, { color: c.textPrimary }]}>Version</Text>
          <Text style={[Typography.body, { color: c.textSecondary }]}>1.0.0</Text>
        </View>
        <View style={[styles.separator, { backgroundColor: c.border }]} />
        <View style={styles.row}>
          <Text style={[Typography.body, { color: c.textPrimary }]}>Storage</Text>
          <Text style={[Typography.body, { color: c.textSecondary }]}>AsyncStorage (Local)</Text>
        </View>
      </View>

      {/* Danger zone */}
      <Text style={[styles.sectionHeader, { color: c.textTertiary }]}>DANGER ZONE</Text>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <TouchableOpacity style={styles.row} onPress={handleClearAllData} activeOpacity={0.7}>
          <Text style={[Typography.body, { color: c.danger }]}>Clear All Data</Text>
          <Text style={[Typography.body, { color: c.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SettingRow({
  label,
  subtitle,
  value,
  onToggle,
  tintColor,
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  tintColor: string;
}) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.text}>
        <Text style={[Typography.body, { color: c.textPrimary }]}>{label}</Text>
        <Text style={[Typography.caption, { color: c.textSecondary }]}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: c.border, true: tintColor + '80' }}
        thumbColor={value ? tintColor : c.textTertiary}
      />
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sectionHeader: {
    ...Typography.caption,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  separator: {
    height: 1,
    marginLeft: Spacing.md,
  },
});
