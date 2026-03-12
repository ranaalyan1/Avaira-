'use client';

export function StatsCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}) {
  return (
    <div className="glow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className="text-xs text-success font-medium">{trend}</span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-foreground/50 mt-1">{label}</p>
    </div>
  );
}
