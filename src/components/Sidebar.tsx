import { BookOpen, Coffee, Home, Settings, TreeDeciduous } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Home', icon: Home },
    { id: 'study' as ViewState, label: 'My Decks', icon: BookOpen },
    { id: 'timer' as ViewState, label: 'Buna Break', icon: Coffee },
  ];

  return (
    <aside className="w-64 h-screen bg-parchment border-r border-earth flex flex-col p-6 sticky top-0 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="w-10 h-10 bg-highland rounded-xl flex items-center justify-center text-parchment shadow-md">
          <TreeDeciduous size={24} />
        </div>
        <h1 className="text-2xl font-bold text-coffee tracking-tight">Tibeb.ai</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-coffee text-parchment shadow-md'
                  : 'text-coffee/70 hover:bg-earth/50 hover:text-coffee'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-gold' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings & Profile */}
      <div className="mt-auto pt-6 border-t border-earth space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-coffee/70 hover:bg-earth/50 hover:text-coffee transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <div className="flex items-center gap-3 px-4 py-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center overflow-hidden">
            <img 
              src="https://picsum.photos/seed/student/100/100" 
              alt="User profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-coffee">Abebe B.</span>
            <span className="text-xs text-coffee/60">Grade 11</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
