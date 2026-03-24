import { useState } from 'react';
import { X, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import { db, handleFirestoreError, OperationType, collection, addDoc, doc, writeBatch } from '../firebase';
import { User } from '../types';

interface GenerateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export default function GenerateDeckModal({ isOpen, onClose, user, onSuccess }: GenerateDeckModalProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: `Create a flashcard deck about: ${topic}. Provide a title and exactly 5 flashcards. Each flashcard must have a 'wax' (surface level question/fact) and a 'gold' (deep meaning/detailed answer).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the flashcard deck" },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    wax: { type: Type.STRING, description: "The surface level question or fact" },
                    gold: { type: Type.STRING, description: "The deep meaning or detailed answer" }
                  },
                  required: ["wax", "gold"]
                }
              }
            },
            required: ["title", "cards"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        
        // Save to Firestore
        const deckRef = await addDoc(collection(db, `users/${user.uid}/decks`), {
          title: data.title,
          description: `AI generated deck about ${topic}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false
        });

        const batch = writeBatch(db);
        data.cards.forEach((card: any) => {
          const cardRef = doc(collection(db, `users/${user.uid}/decks/${deckRef.id}/cards`));
          batch.set(cardRef, {
            wax: card.wax,
            gold: card.gold,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            masteryLevel: 0,
            nextReviewDate: new Date().toISOString()
          });
        });
        
        await batch.commit();
        
        onSuccess();
        onClose();
        setTopic('');
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error("Error generating deck:", err);
      setError("Failed to generate deck. Please try again.");
      if (err instanceof Error && err.message.includes('permission')) {
         handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/decks`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-parchment rounded-3xl shadow-2xl border border-earth w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-earth flex justify-between items-center bg-white">
              <div className="flex items-center gap-2 text-coffee">
                <Sparkles className="text-gold" size={24} />
                <h2 className="text-xl font-bold font-display">Generate Deck</h2>
              </div>
              <button onClick={onClose} className="text-coffee/50 hover:text-coffee transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-coffee/70 text-sm">
                Enter a topic, and our AI will generate a custom "Wax & Gold" flashcard deck for you instantly.
              </p>
              
              <div>
                <label htmlFor="topic" className="block text-sm font-bold text-coffee mb-2">Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Ethiopian History, Quantum Physics..."
                  className="w-full bg-white border border-earth rounded-xl px-4 py-3 text-coffee focus:outline-none focus:border-gold transition-colors"
                  disabled={isGenerating}
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-earth bg-white flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-6 py-2 rounded-full font-bold text-coffee/70 hover:bg-earth/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="px-6 py-2 bg-gold text-coffee rounded-full font-bold hover:bg-gold/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
