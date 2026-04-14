// ─── Core domain types ────────────────────────────────────────────────────────

export interface Deck {
  id: string;
  title: string;
  description: string;
  language: string; // BCP 47 tag, e.g. "en", "zh-Hans", "ja"
  cardCount: number; // denormalized for list display performance
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  color: string; // hex color for visual identity
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string; // definition / question shown first
  back: string; // answer revealed on flip
  hint?: string; // optional hint shown before flip
  createdAt: string;
  updatedAt: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  defaultLanguage: string;
  hapticFeedback: boolean;
  studyShuffled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultLanguage: 'en',
  hapticFeedback: true,
  studyShuffled: false,
};

// ─── Study session ─────────────────────────────────────────────────────────────

export type StudyStatus = 'idle' | 'active' | 'complete';

export interface StudySession {
  deckId: string;
  cards: Flashcard[];
  currentIndex: number;
  knownIds: string[];
  unknownIds: string[];
  status: StudyStatus;
}

// ─── Form input types ─────────────────────────────────────────────────────────

export type CreateDeckInput = Pick<Deck, 'title' | 'description' | 'language' | 'color'>;
export type UpdateDeckInput = Partial<CreateDeckInput>;
export type CreateCardInput = Pick<Flashcard, 'front' | 'back'> & { hint?: string };
export type UpdateCardInput = Partial<CreateCardInput>;
