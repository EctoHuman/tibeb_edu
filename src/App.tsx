/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Coffee, Home, Settings, LogOut, Sparkles, MessageCircle, Mic, BarChart2, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, logOut, signInWithGoogle, onAuthStateChanged, db, handleFirestoreError, OperationType, doc, getDoc, setDoc, onSnapshot } from './firebase';
import BunaBreak from './components/BunaBreak';
import Dashboard from './components/Dashboard';
import FlashcardView from './components/FlashcardView';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TutorChat from './components/TutorChat';
import VoiceChat from './components/VoiceChat';
import AnalyticsView from './components/AnalyticsView';
import StudyRooms from './components/StudyRooms';
import FallingPatternDemo from './components/FallingPatternDemo';
import StackedPanelsDemo from './components/StackedPanelsDemo';
import { ViewState, UserProfile, User } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user document exists, if not create it
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              masteryLevel: 0,
              leaves: 0,
              xp: 0,
              level: 1,
              streak: 0,
              lastStudyDate: new Date().toISOString()
            };
            try {
              await setDoc(userRef, newProfile);
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
            }
            setUserProfile(newProfile);
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
          setCurrentView('dashboard');
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setCurrentView('landing');
        setUserProfile(null);
      }
      
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen for user profile updates
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Home', icon: Home },
    { id: 'study' as ViewState, label: 'Study', icon: BookOpen },
    { id: 'timer' as ViewState, label: 'Break', icon: Coffee },
    { id: 'analytics' as ViewState, label: 'Progress', icon: BarChart2 },
    { id: 'rooms' as ViewState, label: 'Rooms', icon: Users },
    { id: 'falling-pattern' as ViewState, label: 'Pattern', icon: Sparkles },
    { id: 'stacked-panels' as ViewState, label: 'Panels', icon: Sparkles },
  ];

  if (!isAuthReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-parchment text-coffee">
        <div className="animate-pulse flex flex-col items-center">
          <Sparkles className="text-gold mb-4" size={32} />
          <p className="font-display font-bold">Loading Tibeb.ai...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile || currentView === 'landing') {
    return <LandingPage onNavigate={handleLogin} />;
  }

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'dark bg-[#1A1A1A] text-[#F9F7F2]' : 'bg-parchment text-coffee'}`}>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} user={user} userProfile={userProfile} onLogout={logOut} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} user={user} userProfile={userProfile} />}
        {currentView === 'study' && <FlashcardView onNavigate={setCurrentView} user={user} userProfile={userProfile} />}
        {currentView === 'timer' && <BunaBreak onNavigate={setCurrentView} onThemeChange={setIsDarkMode} user={user} userProfile={userProfile} />}
        {currentView === 'analytics' && <AnalyticsView userProfile={userProfile} />}
        {currentView === 'rooms' && <StudyRooms userProfile={userProfile} />}
        {currentView === 'falling-pattern' && <FallingPatternDemo />}
        {currentView === 'stacked-panels' && <StackedPanelsDemo />}
        
        {/* Floating Chat Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-40">
          {!isVoiceOpen && !isChatOpen && (
            <button 
              onClick={() => setIsVoiceOpen(true)}
              className="w-14 h-14 bg-gold text-coffee rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform border-2 border-coffee/10"
              title="Voice Tutor"
            >
              <Mic size={28} />
            </button>
          )}
          {!isChatOpen && !isVoiceOpen && (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-coffee text-gold rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform border-2 border-gold/20"
              title="Text Tutor"
            >
              <MessageCircle size={28} />
            </button>
          )}
        </div>
        
        {/* Chatbots */}
        {isChatOpen && <TutorChat onClose={() => setIsChatOpen(false)} />}
        {isVoiceOpen && <VoiceChat onClose={() => setIsVoiceOpen(false)} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around bg-parchment border-t border-earth p-4 pb-6 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive ? 'text-gold' : 'text-coffee/60 hover:text-coffee'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
