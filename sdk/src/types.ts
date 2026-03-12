export interface Agent {
  id: number;
  name: string;
  metadataURI: string;
  owner: string;
  isActive: boolean;
  registeredAt: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  creator: string;
  reward: bigint;
  assignedAgentId: number;
  status: MissionStatus;
  createdAt: number;
  completedAt: number;
}

export enum MissionStatus {
  Open = 0,
  Assigned = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
}

export interface Reputation {
  agentId: number;
  totalMissions: number;
  completedMissions: number;
  failedMissions: number;
  score: number;
  lastUpdated: number;
}

export interface AvairaConfig {
  rpcUrl: string;
  contracts: {
    token: `0x${string}`;
    registry: `0x${string}`;
    missionManager: `0x${string}`;
    reputation: `0x${string}`;
  };
}
