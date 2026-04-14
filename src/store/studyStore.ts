import { create } from 'zustand';
import { Deck, Flashcard, StudySession, StudyStatus } from '@/types';
import { shuffle } from '@/utils/shuffle';

interface StudyStore {
  session: StudySession | null;
  startSession: (deck: Deck, cards: Flashcard[], shouldShuffle: boolean) => void;
  markKnown: (cardId: string) => void;
  markUnknown: (cardId: string) => void;
  nextCard: () => void;
  previousCard: () => void;
  endSession: () => void;
  resetSession: () => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  session: null,

  startSession: (deck, cards, shouldShuffle) => {
    const orderedCards = shouldShuffle ? shuffle(cards) : cards;
    set({
      session: {
        deckId: deck.id,
        cards: orderedCards,
        currentIndex: 0,
        knownIds: [],
        unknownIds: [],
        status: 'active',
      },
    });
  },

  markKnown: (cardId) => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        knownIds: session.knownIds.includes(cardId)
          ? session.knownIds
          : [...session.knownIds, cardId],
        unknownIds: session.unknownIds.filter((id) => id !== cardId),
      },
    });
  },

  markUnknown: (cardId) => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        unknownIds: session.unknownIds.includes(cardId)
          ? session.unknownIds
          : [...session.unknownIds, cardId],
        knownIds: session.knownIds.filter((id) => id !== cardId),
      },
    });
  },

  nextCard: () => {
    const { session } = get();
    if (!session) return;
    const nextIndex = session.currentIndex + 1;
    const status: StudyStatus = nextIndex >= session.cards.length ? 'complete' : 'active';
    set({ session: { ...session, currentIndex: nextIndex, status } });
  },

  previousCard: () => {
    const { session } = get();
    if (!session || session.currentIndex === 0) return;
    set({
      session: {
        ...session,
        currentIndex: session.currentIndex - 1,
        status: 'active',
      },
    });
  },

  endSession: () => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, status: 'complete' } });
  },

  resetSession: () => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        currentIndex: 0,
        knownIds: [],
        unknownIds: [],
        status: 'active',
      },
    });
  },
}));
