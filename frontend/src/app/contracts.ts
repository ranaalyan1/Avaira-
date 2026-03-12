// Contract addresses - update after deployment
export const CONTRACTS = {
  AvairaToken: '0x0000000000000000000000000000000000000000',
  AgentRegistry: '0x0000000000000000000000000000000000000000',
  MissionManager: '0x0000000000000000000000000000000000000000',
  ReputationEngine: '0x0000000000000000000000000000000000000000',
} as const;

export const AVAIRA_TOKEN_ABI = [
  { inputs: [{ name: 'initialOwner', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' },
] as const;

export const AGENT_REGISTRY_ABI = [
  { inputs: [{ name: 'initialOwner', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [{ name: '_name', type: 'string' }, { name: '_metadataURI', type: 'string' }],
    name: 'registerAgent', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }],
    name: 'toggleAgentStatus', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }],
    name: 'getAgent',
    outputs: [{ components: [{ name: 'name', type: 'string' }, { name: 'metadataURI', type: 'string' }, { name: 'owner', type: 'address' }, { name: 'isActive', type: 'bool' }, { name: 'registeredAt', type: 'uint256' }], name: '', type: 'tuple' }],
    stateMutability: 'view', type: 'function',
  },
  { inputs: [], name: 'nextAgentId', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { anonymous: false, inputs: [{ indexed: true, name: 'agentId', type: 'uint256' }, { indexed: false, name: 'name', type: 'string' }, { indexed: true, name: 'owner', type: 'address' }], name: 'AgentRegistered', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, name: 'agentId', type: 'uint256' }, { indexed: false, name: 'isActive', type: 'bool' }], name: 'AgentStatusChanged', type: 'event' },
] as const;

export const MISSION_MANAGER_ABI = [
  { inputs: [{ name: 'initialOwner', type: 'address' }, { name: '_rewardToken', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [{ name: '_title', type: 'string' }, { name: '_description', type: 'string' }, { name: '_reward', type: 'uint256' }],
    name: 'createMission', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_missionId', type: 'uint256' }, { name: '_agentId', type: 'uint256' }],
    name: 'assignMission', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_missionId', type: 'uint256' }],
    name: 'completeMission', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_missionId', type: 'uint256' }],
    name: 'failMission', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_missionId', type: 'uint256' }],
    name: 'cancelMission', outputs: [], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: '_missionId', type: 'uint256' }],
    name: 'getMission',
    outputs: [{ components: [{ name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'creator', type: 'address' }, { name: 'reward', type: 'uint256' }, { name: 'assignedAgentId', type: 'uint256' }, { name: 'status', type: 'uint8' }, { name: 'createdAt', type: 'uint256' }, { name: 'completedAt', type: 'uint256' }], name: '', type: 'tuple' }],
    stateMutability: 'view', type: 'function',
  },
  { inputs: [], name: 'nextMissionId', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { anonymous: false, inputs: [{ indexed: true, name: 'missionId', type: 'uint256' }, { indexed: false, name: 'title', type: 'string' }, { indexed: true, name: 'creator', type: 'address' }, { indexed: false, name: 'reward', type: 'uint256' }], name: 'MissionCreated', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, name: 'missionId', type: 'uint256' }, { indexed: true, name: 'agentId', type: 'uint256' }], name: 'MissionAssigned', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, name: 'missionId', type: 'uint256' }, { indexed: true, name: 'agentId', type: 'uint256' }, { indexed: false, name: 'reward', type: 'uint256' }], name: 'MissionCompleted', type: 'event' },
] as const;

export const REPUTATION_ENGINE_ABI = [
  { inputs: [{ name: 'initialOwner', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }],
    name: 'getReputation',
    outputs: [{ components: [{ name: 'totalMissions', type: 'uint256' }, { name: 'completedMissions', type: 'uint256' }, { name: 'failedMissions', type: 'uint256' }, { name: 'score', type: 'uint256' }, { name: 'lastUpdated', type: 'uint256' }], name: '', type: 'tuple' }],
    stateMutability: 'view', type: 'function',
  },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }],
    name: 'getScore', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function',
  },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }, { name: '_threshold', type: 'uint256' }],
    name: 'isReliable', outputs: [{ name: '', type: 'bool' }], stateMutability: 'view', type: 'function',
  },
] as const;
