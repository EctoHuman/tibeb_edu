/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Coffee, Home, Settings } from 'lucide-react';
import { useState } from 'react';
import BunaBreak from './components/BunaBreak';
import Dashboard from './components/Dashboard';
import FlashcardView from './components/FlashcardView';
import Sidebar from './components/Sidebar';
import { ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Home', icon: Home },
    { id: 'study' as ViewState, label: 'Study', icon: BookOpen },
    { id: 'timer' as ViewState, label: 'Break', icon: Coffee },
  ];

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'dark bg-[#1A1A1A] text-[#F9F7F2]' : 'bg-parchment text-coffee'}`}>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'study' && <FlashcardView onNavigate={setCurrentView} />}
        {currentView === 'timer' && <BunaBreak onNavigate={setCurrentView} onThemeChange={setIsDarkMode} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around bg-parchment border-t border-earth p-4 pb-6">
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
