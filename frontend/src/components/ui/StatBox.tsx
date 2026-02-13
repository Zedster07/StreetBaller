/**
 * Stat Box Component - For displaying game stats with arcade styling
 */

interface StatBoxProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'gold' | 'purple' | 'orange';
}

const colorMap = {
  primary: {
    text: 'text-primary-500',
    bg: 'bg-gradient-to-br from-primary-500/20 to-primary-500/5 backdrop-blur-md',
    border: 'border-primary-500/50'
  },
  gold: {
    text: 'text-gold',
    bg: 'bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 backdrop-blur-md',
    border: 'border-gold/50'
  },
  purple: {
    text: 'text-purple-500',
    bg: 'bg-gradient-to-br from-purple-600/20 to-purple-600/5 backdrop-blur-md',
    border: 'border-purple/50'
  },
  orange: {
    text: 'text-orange',
    bg: 'bg-gradient-to-br from-orange-600/20 to-orange-600/5 backdrop-blur-md',
    border: 'border-orange/50'
  },
};

export function StatBox({
  icon,
  label,
  value,
  trend,
  trendValue,
  color = 'primary',
}: StatBoxProps) {
  const { text, bg, border } = colorMap[color];

  return (
    <div
      className={`
        rounded-xl p-4 border ${bg} ${border}
        transition-all duration-300 hover:scale-105 hover:shadow-lg
      `}
      style={{
        boxShadow: `0 0 16px ${color === 'primary' ? 'rgba(27, 94, 32, 0.4)' : `rgba(255, 179, 0, 0.3)`}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <span
            className={`text-sm font-bold ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>

      <p className="text-dark-text-secondary text-sm font-medium mb-1">{label}</p>
      <p className={`${text} heading-h4 font-bold`}>{value}</p>
    </div>
  );
}
