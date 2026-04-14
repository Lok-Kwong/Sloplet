import { storageGet, storageSet, storageRemove, STORAGE_KEYS } from './storage';
import { generateId } from '@/utils/uuid';
import { now } from '@/utils/date';
import {
  Deck,
  Flashcard,
  CreateDeckInput,
  UpdateDeckInput,
  CreateCardInput,
  UpdateCardInput,
  AppSettings,
  DEFAULT_SETTINGS,
} from '@/types';

// ─── Deck Repository ──────────────────────────────────────────────────────────

export async function getAllDecks(): Promise<Deck[]> {
  return (await storageGet<Deck[]>(STORAGE_KEYS.DECKS)) ?? [];
}

export async function getDeckById(id: string): Promise<Deck | null> {
  const decks = await getAllDecks();
  return decks.find((d) => d.id === id) ?? null;
}

export async function createDeck(input: CreateDeckInput): Promise<Deck> {
  const decks = await getAllDecks();
  const newDeck: Deck = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    language: input.language || 'en',
    color: input.color,
    cardCount: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  await Promise.all([
    storageSet(STORAGE_KEYS.DECKS, [...decks, newDeck]),
    storageSet(STORAGE_KEYS.cardsForDeck(newDeck.id), []),
  ]);
  return newDeck;
}

export async function updateDeck(id: string, input: UpdateDeckInput): Promise<Deck> {
  const decks = await getAllDecks();
  const index = decks.findIndex((d) => d.id === id);
  if (index === -1) throw new Error(`Deck ${id} not found`);
  const updated: Deck = {
    ...decks[index],
    ...(input.title !== undefined && { title: input.title.trim() }),
    ...(input.description !== undefined && { description: input.description.trim() }),
    ...(input.language !== undefined && { language: input.language }),
    ...(input.color !== undefined && { color: input.color }),
    updatedAt: now(),
  };
  decks[index] = updated;
  await storageSet(STORAGE_KEYS.DECKS, decks);
  return updated;
}

export async function deleteDeck(id: string): Promise<void> {
  const decks = await getAllDecks();
  await Promise.all([
    storageSet(
      STORAGE_KEYS.DECKS,
      decks.filter((d) => d.id !== id)
    ),
    storageRemove(STORAGE_KEYS.cardsForDeck(id)),
  ]);
}

// ─── Card Repository ──────────────────────────────────────────────────────────

export async function getCardsForDeck(deckId: string): Promise<Flashcard[]> {
  return (await storageGet<Flashcard[]>(STORAGE_KEYS.cardsForDeck(deckId))) ?? [];
}

export async function getCardById(
  deckId: string,
  cardId: string
): Promise<Flashcard | null> {
  const cards = await getCardsForDeck(deckId);
  return cards.find((c) => c.id === cardId) ?? null;
}

export async function createCard(
  deckId: string,
  input: CreateCardInput
): Promise<Flashcard> {
  const [cards, decks] = await Promise.all([
    getCardsForDeck(deckId),
    getAllDecks(),
  ]);
  const newCard: Flashcard = {
    id: generateId(),
    deckId,
    front: input.front.trim(),
    back: input.back.trim(),
    ...(input.hint !== undefined && { hint: input.hint.trim() }),
    createdAt: now(),
    updatedAt: now(),
  };
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  if (deckIndex !== -1) {
    decks[deckIndex] = {
      ...decks[deckIndex],
      cardCount: decks[deckIndex].cardCount + 1,
      updatedAt: now(),
    };
  }
  await Promise.all([
    storageSet(STORAGE_KEYS.cardsForDeck(deckId), [...cards, newCard]),
    storageSet(STORAGE_KEYS.DECKS, decks),
  ]);
  return newCard;
}

export async function updateCard(
  deckId: string,
  cardId: string,
  input: UpdateCardInput
): Promise<Flashcard> {
  const cards = await getCardsForDeck(deckId);
  const index = cards.findIndex((c) => c.id === cardId);
  if (index === -1) throw new Error(`Card ${cardId} not found`);
  const updated: Flashcard = {
    ...cards[index],
    ...(input.front !== undefined && { front: input.front.trim() }),
    ...(input.back !== undefined && { back: input.back.trim() }),
    ...(input.hint !== undefined && { hint: input.hint.trim() }),
    updatedAt: now(),
  };
  cards[index] = updated;
  await storageSet(STORAGE_KEYS.cardsForDeck(deckId), cards);
  return updated;
}

export async function deleteCard(deckId: string, cardId: string): Promise<void> {
  const [cards, decks] = await Promise.all([
    getCardsForDeck(deckId),
    getAllDecks(),
  ]);
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  if (deckIndex !== -1) {
    decks[deckIndex] = {
      ...decks[deckIndex],
      cardCount: Math.max(0, decks[deckIndex].cardCount - 1),
      updatedAt: now(),
    };
  }
  await Promise.all([
    storageSet(
      STORAGE_KEYS.cardsForDeck(deckId),
      cards.filter((c) => c.id !== cardId)
    ),
    storageSet(STORAGE_KEYS.DECKS, decks),
  ]);
}

// ─── Settings Repository ──────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
  return (await storageGet<AppSettings>(STORAGE_KEYS.SETTINGS)) ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await storageSet(STORAGE_KEYS.SETTINGS, settings);
}
