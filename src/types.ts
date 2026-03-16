export type ViewState = 'dashboard' | 'study' | 'timer';

export interface Deck {
  id: string;
  title: string;
  cardCount: number;
  masteredCount: number;
  color: string;
}

export interface Flashcard {
  id: string;
  wax: string; // Basic fact
  gold: string; // Deeper context
}
