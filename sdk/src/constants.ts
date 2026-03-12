export const CONTRACTS = {
  // Update after deployment
  AvairaToken: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  AgentRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  MissionManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  ReputationEngine: '0x0000000000000000000000000000000000000000' as `0x${string}`,
};

export const ABIS = {
  AgentRegistry: [
    { inputs: [{ name: '_name', type: 'string' }, { name: '_metadataURI', type: 'string' }], name: 'registerAgent', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ name: '_agentId', type: 'uint256' }], name: 'toggleAgentStatus', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ name: '_agentId', type: 'uint256' }], name: 'getAgent', outputs: [{ components: [{ name: 'name', type: 'string' }, { name: 'metadataURI', type: 'string' }, { name: 'owner', type: 'address' }, { name: 'isActive', type: 'bool' }, { name: 'registeredAt', type: 'uint256' }], name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'nextAgentId', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ],
  MissionManager: [
    { inputs: [{ name: '_title', type: 'string' }, { name: '_description', type: 'string' }, { name: '_reward', type: 'uint256' }], name: 'createMission', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ name: '_missionId', type: 'uint256' }, { name: '_agentId', type: 'uint256' }], name: 'assignMission', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ name: '_missionId', type: 'uint256' }], name: 'getMission', outputs: [{ components: [{ name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'creator', type: 'address' }, { name: 'reward', type: 'uint256' }, { name: 'assignedAgentId', type: 'uint256' }, { name: 'status', type: 'uint8' }, { name: 'createdAt', type: 'uint256' }, { name: 'completedAt', type: 'uint256' }], name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'nextMissionId', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ],
  ReputationEngine: [
    { inputs: [{ name: '_agentId', type: 'uint256' }], name: 'getReputation', outputs: [{ components: [{ name: 'totalMissions', type: 'uint256' }, { name: 'completedMissions', type: 'uint256' }, { name: 'failedMissions', type: 'uint256' }, { name: 'score', type: 'uint256' }, { name: 'lastUpdated', type: 'uint256' }], name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ name: '_agentId', type: 'uint256' }], name: 'getScore', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ],
  AvairaToken: [
    { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  ],
} as const;
