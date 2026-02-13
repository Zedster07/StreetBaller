/**
 * ProfilePanel - Right sidebar content
 * Shows player profile, quick stats, and level progress
 */



export function ProfilePanel() {
  const stats = [
    { label: 'Played', value: '72', icon: '⚽' },
    { label: 'Skills', value: '32', icon: '⚡' },
    { label: 'Mastery', value: '412', icon: '💎' },
  ];

  return (
    <div className="flex flex-col h-full space-y-12">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-neon-green p-1 group cursor-pointer overflow-hidden">
            <div className="w-full h-full rounded-full bg-dark-surface-3 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              👤
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-neon-green rounded-full border-4 border-dark-bg" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="heading-h4 text-white">Nadia Juma</h2>
          <p className="body-small text-dark-text-tertiary uppercase tracking-widest font-bold">Pro Striker</p>
        </div>

        <button className="w-full py-3 bg-neon-green text-black font-bold rounded-2xl hover:bg-neon-cyan transition-colors shadow-lg shadow-neon-green/20">
          VIEW PROFILE
        </button>
      </div>

      {/* Stats Checklist */}
      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-dark-surface-2 flex items-center justify-center text-xl group-hover:bg-dark-surface-3 border border-white/5 transition-colors">
              {stat.icon}
            </div>
            <div>
              <p className="heading-h5 text-white">{stat.value}</p>
              <p className="body-tiny text-dark-text-tertiary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Level / Progress */}
      <div className="mt-auto">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-dark-surface-2 to-dark-bg border border-white/5">
          <p className="label-small text-white/40 mb-2">SEASON PROGRESS</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-white">73%</span>
            <span className="text-neon-green text-sm font-bold mb-1">LEVEL 12</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan w-3/4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
