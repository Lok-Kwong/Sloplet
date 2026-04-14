import { create } from 'zustand';
import {
  Deck,
  Flashcard,
  CreateDeckInput,
  UpdateDeckInput,
  CreateCardInput,
  UpdateCardInput,
} from '@/types';
import * as repo from '@/db/repository';

interface DeckStore {
  // All decks
  decks: Deck[];
  isLoadingDecks: boolean;

  // Active deck + its cards
  activeDeck: Deck | null;
  activeCards: Flashcard[];
  isLoadingDeck: boolean;

  // Deck actions
  loadDecks: () => Promise<void>;
  addDeck: (input: CreateDeckInput) => Promise<Deck>;
  editDeck: (id: string, input: UpdateDeckInput) => Promise<void>;
  removeDeck: (id: string) => Promise<void>;

  // Deck detail actions
  loadDeck: (id: string) => Promise<void>;
  addCard: (deckId: string, input: CreateCardInput) => Promise<Flashcard>;
  editCard: (deckId: string, cardId: string, input: UpdateCardInput) => Promise<void>;
  removeCard: (deckId: string, cardId: string) => Promise<void>;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  isLoadingDecks: false,
  activeDeck: null,
  activeCards: [],
  isLoadingDeck: false,

  loadDecks: async () => {
    set({ isLoadingDecks: true });
    try {
      const decks = await repo.getAllDecks();
      // Sort by most recently updated first
      decks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ decks });
    } finally {
      set({ isLoadingDecks: false });
    }
  },

  addDeck: async (input) => {
    const newDeck = await repo.createDeck(input);
    set((state) => ({
      decks: [newDeck, ...state.decks],
    }));
    return newDeck;
  },

  editDeck: async (id, input) => {
    const updated = await repo.updateDeck(id, input);
    set((state) => ({
      decks: state.decks.map((d) => (d.id === id ? updated : d)),
      activeDeck: state.activeDeck?.id === id ? updated : state.activeDeck,
    }));
  },

  removeDeck: async (id) => {
    await repo.deleteDeck(id);
    set((state) => ({
      decks: state.decks.filter((d) => d.id !== id),
      activeDeck: state.activeDeck?.id === id ? null : state.activeDeck,
      activeCards: state.activeDeck?.id === id ? [] : state.activeCards,
    }));
  },

  loadDeck: async (id) => {
    set({ isLoadingDeck: true });
    try {
      const [deck, cards] = await Promise.all([
        repo.getDeckById(id),
        repo.getCardsForDeck(id),
      ]);
      set({ activeDeck: deck, activeCards: cards });
    } finally {
      set({ isLoadingDeck: false });
    }
  },

  addCard: async (deckId, input) => {
    const newCard = await repo.createCard(deckId, input);
    set((state) => ({
      activeCards: [...state.activeCards, newCard],
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cardCount: d.cardCount + 1 } : d
      ),
      activeDeck:
        state.activeDeck?.id === deckId
          ? { ...state.activeDeck, cardCount: state.activeDeck.cardCount + 1 }
          : state.activeDeck,
    }));
    return newCard;
  },

  editCard: async (deckId, cardId, input) => {
    const updated = await repo.updateCard(deckId, cardId, input);
    set((state) => ({
      activeCards: state.activeCards.map((c) => (c.id === cardId ? updated : c)),
    }));
  },

  removeCard: async (deckId, cardId) => {
    await repo.deleteCard(deckId, cardId);
    set((state) => ({
      activeCards: state.activeCards.filter((c) => c.id !== cardId),
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cardCount: Math.max(0, d.cardCount - 1) } : d
      ),
      activeDeck:
        state.activeDeck?.id === deckId
          ? {
              ...state.activeDeck,
              cardCount: Math.max(0, state.activeDeck.cardCount - 1),
            }
          : state.activeDeck,
    }));
  },
}));
