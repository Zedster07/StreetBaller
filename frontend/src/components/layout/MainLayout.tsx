/**
 * Main Layout - Wraps all pages with Header and BottomNav
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function MainLayout({
  children,
  rightPanel,
  activeTab = 'home',
  onTabChange = () => { },
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#100E0C] text-white flex overflow-hidden font-body">
      {/* Warm ambient glow — adds depth and warmth to the dark canvas */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: [
            'radial-gradient(ellipse at 12% 0%, rgba(180, 120, 50, 0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 85% 100%, rgba(16, 185, 129, 0.025) 0%, transparent 45%)',
          ].join(', '),
        }}
      />

      {/* Sidebar - Desktop Only */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[72px] lg:pl-60 relative overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-[#100E0C]/95 backdrop-blur-md border-b border-white/[0.04]">
          <Header />
        </div>

        {/* content wrapper */}
        <div className="flex flex-col xl:flex-row flex-1 min-h-0">
          {/* Central content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 overflow-y-auto">
            {children}
          </main>

          {/* Right Panel - Profile/Stats */}
          {rightPanel && (
            <aside className="w-full xl:w-80 p-6 bg-[#100E0C] border-l border-white/[0.04] overflow-y-auto hidden xl:block">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
