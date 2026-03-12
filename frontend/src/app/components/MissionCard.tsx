'use client';

const MISSION_STATUS = ['Open', 'Assigned', 'Completed', 'Failed', 'Cancelled'];
const STATUS_COLORS: Record<string, string> = {
  Open: 'badge-active',
  Assigned: 'badge-pending',
  Completed: 'badge-active',
  Failed: 'badge-inactive',
  Cancelled: 'badge-inactive',
};

export interface MissionData {
  id: number;
  title: string;
  description: string;
  reward: string;
  status: number;
  assignedAgentId: number;
  creator: string;
}

export function MissionCard({ mission }: { mission: MissionData }) {
  const statusText = MISSION_STATUS[mission.status] || 'Unknown';

  return (
    <div className="glow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{mission.title}</h3>
        <span className={`badge ${STATUS_COLORS[statusText] || ''}`}>
          {statusText}
        </span>
      </div>
      <p className="text-sm text-foreground/50 mb-4 line-clamp-2">
        {mission.description}
      </p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-accent font-mono font-bold">{mission.reward} AVRA</span>
        {mission.assignedAgentId > 0 && (
          <span className="text-foreground/40">Agent #{mission.assignedAgentId}</span>
        )}
      </div>
    </div>
  );
}
