import { Icon } from '@/components/ui';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function Sidebar({ activeTab = 'home', onTabChange = () => { } }: SidebarProps) {

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'matches', icon: 'matches', label: 'Matches' },
    { id: 'leaderboard', icon: 'rankings', label: 'Rankings' },
    { id: 'teams', icon: 'teams', label: 'Teams' },
    { id: 'achievements', icon: 'awards', label: 'Awards' },
    { id: 'profile', icon: 'profile', label: 'Profile' },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-[72px] lg:w-60 fixed left-0 top-0 bottom-0 z-50 
        bg-[#0D0B09] border-r border-[#2a2420]/30"
    >
      {/* Brand Area */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-[#2a2420]/30">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-sm text-black tracking-tight">
          SB
        </div>
        <span className="hidden lg:block ml-3 font-display font-semibold text-[15px] text-white/90 tracking-tight">
          StreetBaller
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 w-full py-6 space-y-0.5 px-2 lg:px-3">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-emerald-500/[0.08] text-emerald-400'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full" />
              )}

              <Icon 
                name={item.icon} 
                size={18}
                className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-white/35 group-hover:text-white/60'}`}
              />
              <span className={`hidden lg:block text-[13px] tracking-wide ${isActive ? 'font-medium text-emerald-400' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto p-3 border-t border-[#2a2420]/30">
        <div className="flex flex-col space-y-0.5">
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all duration-200">
            <Icon name="settings" size={18} />
            <span className="hidden lg:block text-[13px]">Settings</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all duration-200">
            <Icon name="logout" size={18} />
            <span className="hidden lg:block text-[13px]">Logout</span>
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="mt-4 flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.025] border border-[#2a2420]/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[11px] font-semibold text-white">
            JD
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-[13px] font-medium text-white/80 truncate">John Doe</p>
            <p className="text-[11px] text-white/30 truncate">Pro Player</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
