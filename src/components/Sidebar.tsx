import { BookOpen, Coffee, Home, Settings, TreeDeciduous, LogOut, BarChart2, Users, Sparkles } from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user?: User;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

export default function Sidebar({ currentView, onNavigate, user, userProfile, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Home', icon: Home },
    { id: 'study' as ViewState, label: 'My Decks', icon: BookOpen },
    { id: 'timer' as ViewState, label: 'Buna Break', icon: Coffee },
    { id: 'analytics' as ViewState, label: 'Progress', icon: BarChart2 },
    { id: 'rooms' as ViewState, label: 'Study Rooms', icon: Users },
    { id: 'falling-pattern' as ViewState, label: 'Pattern', icon: TreeDeciduous },
    { id: 'stacked-panels' as ViewState, label: 'Panels', icon: Sparkles },
  ];

  return (
    <aside className="w-64 h-screen bg-parchment border-r border-earth flex flex-col p-6 sticky top-0 hidden md:flex shrink-0">
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
        {userProfile && (
          <div className="px-4 py-3 mb-2 bg-earth/30 rounded-2xl border border-earth/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-coffee/70 uppercase tracking-wider">Level {userProfile.level || 1}</span>
              <span className="text-xs font-bold text-gold">{userProfile.xp || 0} XP</span>
            </div>
            <div className="w-full h-2 bg-earth rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${((userProfile.xp || 0) % 1000) / 10}%` }}
              />
            </div>
            <div className="text-[10px] text-coffee/50 mt-1 text-right">
              {1000 - ((userProfile.xp || 0) % 1000)} XP to next level
            </div>
          </div>
        )}
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-coffee/70 hover:bg-earth/50 hover:text-coffee transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        {onLogout && (
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        )}
        <div className="flex items-center gap-3 px-4 py-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={user?.photoURL || "https://picsum.photos/seed/student/100/100"} 
              alt="User profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-coffee truncate">{user?.displayName || 'Student'}</span>
            <span className="text-xs text-coffee/60 truncate">{user?.email || 'Scholar'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
