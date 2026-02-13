/**
 * Header Component - Clean mobile top bar
 * Minimal design with proper visual hierarchy
 */

import { Icon } from '@/components/ui';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ title = 'StreetBaller' }: HeaderProps) {
  return (
    <header className="h-14 bg-[#100E0C]/95 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-xs text-black">
            SB
          </div>
          <h1 className="text-[15px] font-display font-semibold text-white/90 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <Icon name="search" size={18} className="text-white/40" />
          </button>

          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <Icon name="bell" size={18} className="text-white/40" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User avatar */}
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ml-1">
            <span className="text-white font-medium text-[11px]">JD</span>
          </button>
        </div>
      </div>
    </header>
  );
}
