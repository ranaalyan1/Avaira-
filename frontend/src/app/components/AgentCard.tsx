'use client';

export interface AgentData {
  id: number;
  name: string;
  metadataURI: string;
  owner: string;
  isActive: boolean;
  registeredAt: number;
}

export function AgentCard({ agent }: { agent: AgentData }) {
  return (
    <div className="glow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/30 flex items-center justify-center">
            <span className="text-accent font-bold">#{agent.id}</span>
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-foreground/40 font-mono">
              {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}
            </p>
          </div>
        </div>
        <span className={`badge ${agent.isActive ? 'badge-active' : 'badge-inactive'}`}>
          {agent.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-foreground/40">
        <span>Registered {new Date(agent.registeredAt * 1000).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
