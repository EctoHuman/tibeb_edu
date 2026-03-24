export type ViewState = 'landing' | 'dashboard' | 'study' | 'timer' | 'analytics' | 'rooms' | 'falling-pattern' | 'stacked-panels';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  masteredCount: number;
  color: string;
  authorId: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  wax: string; // Basic fact
  gold: string; // Deeper context
  mastery?: number;
  interval?: number;
  repetition?: number;
  efactor?: number;
  nextReviewDate?: string;
  lastReviewed?: string;
  authorId: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  masteryLevel?: number;
  leaves?: number;
  xp?: number;
  level?: number;
  streak?: number;
  lastStudyDate?: string;
  createdAt: string;
}

export interface StudyLog {
  id: string;
  date: string;
  cardsReviewed: number;
  xpEarned: number;
  forgotCount: number;
  doubtfulCount: number;
  knewCount: number;
  authorId: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  createdAt: any;
  createdBy: string;
  activeUsers: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    joinedAt: string;
  }[];
}
