/**
 * Home Screen / Dashboard
 * Bento Grid layout with Glassmorphism cards (2026 Design Trends)
 * - Asymmetric bento grid for visual hierarchy
 * - Dark glassmorphism cards with subtle borders
 * - SVG icons instead of emojis
 * - Clean typography with proper whitespace
 * - Progressive disclosure for secondary info
 */

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { GlassCard, ModernButton, Badge, Icon } from '@/components/ui';

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');

  // Mock data
  const playerStats = {
    matchesPlayed: 24,
    wins: 18,
    rating: 8.7,
    trustScore: 95,
    winRate: 75,
    streak: 5,
  };

  const upcomingMatches = [
    {
      id: 1,
      title: 'Downtown Street Soccer',
      date: 'Today',
      time: '6:00 PM',
      players: 8,
      maxPlayers: 10,
      location: 'Riverside Pitch',
    },
    {
      id: 2,
      title: 'Park Memorial Cup',
      date: 'Tomorrow',
      time: '5:30 PM',
      players: 12,
      maxPlayers: 14,
      location: 'Central Ground',
    },
  ];

  const yourTeams = [
    { id: 1, name: 'City Slickers', wins: 12, rating: 8.5, members: 7, role: 'Captain' },
    { id: 2, name: 'Park Warriors', wins: 8, rating: 8.2, members: 6, role: 'Player' },
  ];

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* ============================================================
            ROW 1: Hero Welcome + Primary Stat (Bento Row)
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Hero Card — spans 2 cols */}
          <GlassCard className="lg:col-span-2 relative overflow-hidden" padding="lg">
            {/* Subtle background gradient glow — warm + emerald */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/[0.05] blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-700/[0.035] blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <p className="text-[13px] text-white/40 font-medium tracking-wide uppercase">
                  Welcome back
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                  John <span className="text-emerald-400">Doe</span>
                </h1>
                <p className="text-[15px] text-white/40 max-w-lg">
                  You're <span className="text-emerald-400 font-medium">3 weeks</span> into your season 
                  with a <span className="text-emerald-400 font-medium">{playerStats.streak}-match</span> win streak.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <ModernButton variant="primary" size="lg" icon={<Icon name="target" size={16} />}>
                  Find a Match
                </ModernButton>
                <ModernButton variant="secondary" size="lg" icon={<Icon name="trending-up" size={16} />}>
                  View Stats
                </ModernButton>
              </div>
            </div>
          </GlassCard>

          {/* Win Rate Ring Card */}
          <GlassCard className="flex flex-col items-center justify-center text-center relative overflow-hidden" padding="lg">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
              {/* Circular Progress */}
              <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#winRateGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${playerStats.winRate * 2.64} 264`}
                  />
                  <defs>
                    <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{playerStats.winRate}%</span>
                  <span className="text-[11px] text-white/30 font-medium">WIN RATE</span>
                </div>
              </div>
              <p className="text-[13px] text-white/40">
                <span className="text-emerald-400 font-medium">{playerStats.wins}W</span>
                <span className="mx-1.5 text-white/15">·</span>
                <span className="text-white/50">{playerStats.matchesPlayed - playerStats.wins}L</span>
                <span className="mx-1.5 text-white/15">·</span>
                <span className="text-white/50">{playerStats.matchesPlayed} Total</span>
              </p>
            </div>
          </GlassCard>
        </div>

        {/* ============================================================
            ROW 2: Stats Bento Grid (Asymmetric sizes for hierarchy)
            ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Matches — larger emphasis */}
          <GlassCard padding="md" hoverable className="group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.10] flex items-center justify-center">
                <Icon name="target" size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Icon name="trending-up" size={12} />
                <span className="text-[11px] font-medium">+4</span>
              </div>
            </div>
            <p className="text-[12px] text-white/35 font-medium tracking-wide uppercase mb-1">Matches</p>
            <p className="text-2xl font-bold text-white tracking-tight">{playerStats.matchesPlayed}</p>
          </GlassCard>

          {/* Wins */}
          <GlassCard padding="md" hoverable className="group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/[0.10] flex items-center justify-center">
                <Icon name="trophy" size={16} className="text-amber-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Icon name="trending-up" size={12} />
                <span className="text-[11px] font-medium">+2</span>
              </div>
            </div>
            <p className="text-[12px] text-white/35 font-medium tracking-wide uppercase mb-1">Wins</p>
            <p className="text-2xl font-bold text-white tracking-tight">{playerStats.wins}</p>
          </GlassCard>

          {/* Rating */}
          <GlassCard padding="md" hoverable className="group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/[0.10] flex items-center justify-center">
                <Icon name="star" size={16} className="text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Icon name="trending-up" size={12} />
                <span className="text-[11px] font-medium">+0.3</span>
              </div>
            </div>
            <p className="text-[12px] text-white/35 font-medium tracking-wide uppercase mb-1">Rating</p>
            <p className="text-2xl font-bold text-white tracking-tight">{playerStats.rating}</p>
          </GlassCard>

          {/* Trust Score */}
          <GlassCard padding="md" hoverable className="group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/[0.10] flex items-center justify-center">
                <Icon name="shield" size={16} className="text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-white/30">
                <Icon name="minus" size={12} />
                <span className="text-[11px] font-medium">Stable</span>
              </div>
            </div>
            <p className="text-[12px] text-white/35 font-medium tracking-wide uppercase mb-1">Trust</p>
            <p className="text-2xl font-bold text-white tracking-tight">{playerStats.trustScore}%</p>
          </GlassCard>
        </div>

        {/* ============================================================
            ROW 3: Matches + Teams (Two-column bento)
            ============================================================ */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Upcoming Matches — wider */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Icon name="calendar" size={16} className="text-white/30" />
                <h2 className="text-[15px] font-semibold text-white/80 tracking-tight">Upcoming Matches</h2>
              </div>
              <button className="text-[12px] text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <GlassCard key={match.id} hoverable padding="md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-[15px] font-semibold text-white/90 tracking-tight">{match.title}</h3>
                      <div className="flex items-center gap-2 text-[12px] text-white/35">
                        <span>{match.date} at {match.time}</span>
                        <span className="text-white/15">·</span>
                        <span>{match.location}</span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm" dot>Upcoming</Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[12px] mb-2">
                      <div className="flex items-center gap-2 text-white/35">
                        <Icon name="users" size={14} className="text-white/25" />
                        <span>Players Joined</span>
                      </div>
                      <span className="text-white/60 font-medium">{match.players}/{match.maxPlayers}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${(match.players / match.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <ModernButton variant="primary" size="sm" fullWidth>
                      Join Match
                    </ModernButton>
                    <ModernButton variant="secondary" size="sm" fullWidth>
                      Details
                    </ModernButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Your Teams — narrower column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Icon name="teams" size={16} className="text-white/30" />
                <h2 className="text-[15px] font-semibold text-white/80 tracking-tight">Your Teams</h2>
              </div>
              <button className="text-[12px] text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {yourTeams.map((team) => (
                <GlassCard key={team.id} hoverable padding="md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/10 flex items-center justify-center">
                      <Icon name="teams" size={18} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-white/90 tracking-tight truncate">{team.name}</h3>
                      <p className="text-[11px] text-emerald-400/60 font-medium tracking-wide uppercase">{team.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.04] text-center">
                      <p className="text-[10px] text-white/30 font-medium uppercase mb-0.5">Wins</p>
                      <p className="text-[15px] text-white/80 font-semibold">{team.wins}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.04] text-center">
                      <p className="text-[10px] text-white/30 font-medium uppercase mb-0.5">Rating</p>
                      <p className="text-[15px] text-white/80 font-semibold">{team.rating}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.04] text-center">
                      <p className="text-[10px] text-white/30 font-medium uppercase mb-0.5">Members</p>
                      <p className="text-[15px] text-white/80 font-semibold">{team.members}</p>
                    </div>
                  </div>

                  <ModernButton variant="secondary" size="sm" fullWidth>
                    Manage Team
                  </ModernButton>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            ROW 4: Quick Actions (3-col bento grid)
            ============================================================ */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Icon name="zap" size={16} className="text-white/30" />
            <h2 className="text-[15px] font-semibold text-white/80 tracking-tight">Quick Actions</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <GlassCard hoverable padding="md" className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.10] flex items-center justify-center group-hover:bg-emerald-500/[0.18] transition-colors">
                  <Icon name="plus" size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors">Create Match</p>
                  <p className="text-[12px] text-white/30">Set up a new game</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hoverable padding="md" className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/[0.10] flex items-center justify-center group-hover:bg-blue-500/[0.18] transition-colors">
                  <Icon name="teams" size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors">Start Team</p>
                  <p className="text-[12px] text-white/30">Build your squad</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hoverable padding="md" className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/[0.10] flex items-center justify-center group-hover:bg-purple-500/[0.18] transition-colors">
                  <Icon name="trophy" size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors">Join Tournament</p>
                  <p className="text-[12px] text-white/30">Compete & climb ranks</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ============================================================
            ROW 5: Recent Achievements (Horizontal scroll on mobile)
            ============================================================ */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Icon name="awards" size={16} className="text-white/30" />
              <h2 className="text-[15px] font-semibold text-white/80 tracking-tight">Recent Achievements</h2>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: 'trophy', label: 'Hat Trick Master', bgClass: 'bg-amber-500/[0.1]', textClass: 'text-amber-400' },
              { icon: 'star', label: 'Rising Star', bgClass: 'bg-purple-500/[0.1]', textClass: 'text-purple-400' },
              { icon: 'fire', label: 'On Fire (5 wins)', bgClass: 'bg-orange-500/[0.1]', textClass: 'text-orange-400' },
              { icon: 'shield', label: 'Reliable Player', bgClass: 'bg-emerald-500/[0.1]', textClass: 'text-emerald-400' },
            ].map((achievement) => (
              <GlassCard
                key={achievement.label}
                padding="sm"
                hoverable
                className="flex-shrink-0 min-w-[160px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${achievement.bgClass} flex items-center justify-center`}>
                    <Icon name={achievement.icon} size={14} className={achievement.textClass} />
                  </div>
                  <span className="text-[13px] font-medium text-white/60 whitespace-nowrap">{achievement.label}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
