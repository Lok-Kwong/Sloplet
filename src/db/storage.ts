import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  DECKS: 'decks',
  SETTINGS: 'settings',
  cardsForDeck: (deckId: string) => `cards:${deckId}`,
} as const;

export async function storageGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function storageRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function storageClearAll(): Promise<void> {
  await AsyncStorage.clear();
}
