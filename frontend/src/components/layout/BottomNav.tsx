/**
 * Bottom Navigation - Mobile-first 5-tab navigation
 * Clean minimal design — no heavy glow effects
 */

import { Icon } from '@/components/ui';

interface NavTab {
  id: string;
  icon: string;
  label: string;
  path: string;
  badge?: number;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: NavTab[];
}

const defaultTabs: NavTab[] = [
  { id: 'home', icon: 'home', label: 'Home', path: '/' },
  { id: 'matches', icon: 'matches', label: 'Matches', path: '/matches' },
  { id: 'leaderboard', icon: 'rankings', label: 'Rankings', path: '/leaderboard' },
  { id: 'teams', icon: 'teams', label: 'Teams', path: '/teams' },
  { id: 'profile', icon: 'profile', label: 'Profile', path: '/profile' },
];

export function BottomNav({
  activeTab,
  onTabChange,
  tabs = defaultTabs,
}: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[72px] bg-[#100E0C]/95 backdrop-blur-xl 
        border-t border-white/[0.04] md:hidden z-40 safe-area-bottom"
    >
      <div className="h-full flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl
                transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-white/30 hover:text-white/50'
                }`}
            >
              <Icon name={tab.icon} size={20} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>

              {/* Badge */}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}

              {/* Active dot */}
              {isActive && (
                <div className="absolute -bottom-0 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
