import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="deck/new"
          options={{
            title: 'New Deck',
            presentation: 'modal',
            headerStyle: { backgroundColor: c.surface },
          }}
        />
        <Stack.Screen
          name="deck/[id]/edit"
          options={{
            title: 'Edit Deck',
            presentation: 'modal',
            headerStyle: { backgroundColor: c.surface },
          }}
        />
        <Stack.Screen
          name="deck/[id]/study"
          options={{
            title: 'Study',
            headerStyle: { backgroundColor: c.background },
          }}
        />
        <Stack.Screen
          name="deck/[id]/index"
          options={{
            title: 'Deck',
            headerStyle: { backgroundColor: c.surface },
          }}
        />
        <Stack.Screen
          name="card/new"
          options={{
            title: 'Add Card',
            presentation: 'modal',
            headerStyle: { backgroundColor: c.surface },
          }}
        />
        <Stack.Screen
          name="card/[id]/edit"
          options={{
            title: 'Edit Card',
            presentation: 'modal',
            headerStyle: { backgroundColor: c.surface },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
