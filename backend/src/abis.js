const AGENT_REGISTRY_ABI = [
  "function getAgent(uint256 _agentId) view returns (tuple(string name, string metadataURI, address owner, bool isActive, uint256 registeredAt))",
  "function nextAgentId() view returns (uint256)",
  "event AgentRegistered(uint256 indexed agentId, string name, address indexed owner)",
  "event AgentStatusChanged(uint256 indexed agentId, bool isActive)",
];

const MISSION_MANAGER_ABI = [
  "function getMission(uint256 _missionId) view returns (tuple(string title, string description, address creator, uint256 reward, uint256 assignedAgentId, uint8 status, uint256 createdAt, uint256 completedAt))",
  "function nextMissionId() view returns (uint256)",
  "event MissionCreated(uint256 indexed missionId, string title, address indexed creator, uint256 reward)",
  "event MissionAssigned(uint256 indexed missionId, uint256 indexed agentId)",
  "event MissionCompleted(uint256 indexed missionId, uint256 indexed agentId, uint256 reward)",
];

const AVAIRA_TOKEN_ABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

const REPUTATION_ENGINE_ABI = [
  "function getReputation(uint256 _agentId) view returns (tuple(uint256 totalMissions, uint256 completedMissions, uint256 failedMissions, uint256 score, uint256 lastUpdated))",
  "function getScore(uint256 _agentId) view returns (uint256)",
  "function isReliable(uint256 _agentId, uint256 _threshold) view returns (bool)",
];

module.exports = {
  AGENT_REGISTRY_ABI,
  MISSION_MANAGER_ABI,
  AVAIRA_TOKEN_ABI,
  REPUTATION_ENGINE_ABI,
};
