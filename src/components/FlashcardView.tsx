import { ArrowLeft, Check, HelpCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Flashcard, ViewState, UserProfile } from '../types';
import { User } from '../types';
import { calculateSM2, getNextReviewDate, Quality } from '../utils/sm2';
import { recordStudySession } from '../utils/studyProgress';

interface FlashcardViewProps {
  onNavigate: (view: ViewState) => void;
  user?: User;
  userProfile?: UserProfile | null;
}

const mockCards: Flashcard[] = [
  {
    id: '1',
    wax: 'What is the powerhouse of the cell?',
    gold: 'Mitochondria generate most of the chemical energy needed to power the cell\'s biochemical reactions. This energy is stored in ATP.',
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    authorId: 'mock',
  },
  {
    id: '2',
    wax: 'When was the Battle of Adwa?',
    gold: 'March 1, 1896. It was a climactic battle of the First Italo-Ethiopian War, securing Ethiopian sovereignty and becoming a symbol of Pan-Africanism.',
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    authorId: 'mock',
  },
  {
    id: '3',
    wax: 'What is an inverse function?',
    gold: 'A function that "undoes" another function. If f(x) = y, then the inverse function f⁻¹(y) = x. The graph is reflected across the line y = x.',
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    authorId: 'mock',
  },
];

export default function FlashcardView({ onNavigate, user, userProfile }: FlashcardViewProps) {
  const [cards, setCards] = useState<Flashcard[]>(mockCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'wax' | 'gold'>('wax');
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, xpGained: 0 });

  const currentCard = cards[currentIndex];

  const handleReview = async (quality: Quality) => {
    if (!currentCard) return;

    // Calculate new SM-2 values
    const newSM2 = calculateSM2(quality, {
      interval: currentCard.interval || 0,
      repetition: currentCard.repetition || 0,
      efactor: currentCard.efactor || 2.5,
    });

    const nextReviewDate = getNextReviewDate(newSM2.interval);

    // Update local card state (in a real app, this would update Firestore)
    const updatedCards = [...cards];
    updatedCards[currentIndex] = {
      ...currentCard,
      ...newSM2,
      nextReviewDate,
      lastReviewed: new Date().toISOString(),
    };
    setCards(updatedCards);

    // Calculate XP based on quality
    const xpGained = quality >= 3 ? 10 : 5;
    
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      xpGained: prev.xpGained + xpGained
    }));

    // Record progress in Firebase
    if (user) {
      await recordStudySession(user.uid, xpGained, quality);
    }

    // Move to next card
    setIsFlipped(false);
    setMode('wax');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  if (!currentCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-tibeb-pattern">
        <h2 className="text-2xl font-bold text-coffee mb-4">All caught up!</h2>
        <p className="text-coffee/70 mb-8">You've reviewed all your cards for now.</p>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-coffee text-parchment rounded-2xl font-bold hover:bg-coffee/90 transition-colors shadow-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 bg-tibeb-pattern h-full overflow-hidden">
      <header className="flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-coffee/70 hover:text-coffee transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-gold bg-earth/30 px-3 py-1 rounded-full">
            +{sessionStats.xpGained} XP
          </div>
          <div className="text-coffee font-bold">
            Card {currentIndex + 1} of {cards.length}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Wax & Gold Toggle */}
        <div className="flex bg-earth/50 p-1 rounded-full mb-8 shadow-inner">
          <button
            onClick={() => setMode('wax')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              mode === 'wax' 
                ? 'bg-parchment text-coffee shadow-sm' 
                : 'text-coffee/60 hover:text-coffee'
            }`}
          >
            Wax (Surface)
          </button>
          <button
            onClick={() => setMode('gold')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              mode === 'gold' 
                ? 'bg-gold text-parchment shadow-sm' 
                : 'text-coffee/60 hover:text-coffee'
            }`}
          >
            Gold (Depth)
          </button>
        </div>

        {/* Flashcard */}
        <div className="w-full aspect-[4/3] perspective-1000 mb-12">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-parchment border-2 border-earth rounded-3xl shadow-xl flex flex-col items-center justify-center p-10 text-center">
              <span className="absolute top-6 left-6 text-xs font-bold text-coffee/40 uppercase tracking-widest">Question</span>
              <h2 className="text-3xl md:text-4xl font-bold text-coffee leading-tight">
                {currentCard.wax}
              </h2>
              <p className="absolute bottom-6 text-sm text-coffee/50 font-medium">Tap to flip</p>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden bg-coffee border-2 border-coffee rounded-3xl shadow-xl flex flex-col items-center justify-center p-10 text-center rotate-y-180">
              <span className="absolute top-6 left-6 text-xs font-bold text-parchment/40 uppercase tracking-widest">Answer</span>
              <div className="text-xl md:text-2xl font-medium text-parchment leading-relaxed">
                {mode === 'wax' ? (
                  <p className="opacity-80 italic">Switch to "Gold" to reveal the deeper context.</p>
                ) : (
                  <p>{currentCard.gold}</p>
                )}
              </div>
              <p className="absolute bottom-6 text-sm text-parchment/50 font-medium">Tap to flip back</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <button 
            onClick={() => handleReview(1)}
            className="flex-1 py-4 bg-red-100 text-red-700 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-red-200 transition-colors shadow-sm"
          >
            <X size={24} />
            <span>Forgot</span>
          </button>
          <button 
            onClick={() => handleReview(3)}
            className="flex-1 py-4 bg-yellow-100 text-yellow-700 rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-yellow-200 transition-colors shadow-sm"
          >
            <HelpCircle size={24} />
            <span>Doubtful</span>
          </button>
          <button 
            onClick={() => handleReview(5)}
            className="flex-1 py-4 bg-highland/20 text-highland rounded-2xl font-bold flex flex-col items-center gap-1 hover:bg-highland/30 transition-colors shadow-sm"
          >
            <Check size={24} />
            <span>Knew it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
