const { ethers } = require("ethers");
const {
  AGENT_REGISTRY_ABI,
  MISSION_MANAGER_ABI,
  AVAIRA_TOKEN_ABI,
  REPUTATION_ENGINE_ABI,
} = require("./abis");

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contracts = {};
  }

  init() {
    const addresses = {
      token: process.env.AVAIRA_TOKEN_ADDRESS,
      registry: process.env.AGENT_REGISTRY_ADDRESS,
      missions: process.env.MISSION_MANAGER_ADDRESS,
      reputation: process.env.REPUTATION_ENGINE_ADDRESS,
    };

    const zero = "0x0000000000000000000000000000000000000000";

    if (addresses.token && addresses.token !== zero) {
      this.contracts.token = new ethers.Contract(addresses.token, AVAIRA_TOKEN_ABI, this.provider);
    }
    if (addresses.registry && addresses.registry !== zero) {
      this.contracts.registry = new ethers.Contract(addresses.registry, AGENT_REGISTRY_ABI, this.provider);
    }
    if (addresses.missions && addresses.missions !== zero) {
      this.contracts.missions = new ethers.Contract(addresses.missions, MISSION_MANAGER_ABI, this.provider);
    }
    if (addresses.reputation && addresses.reputation !== zero) {
      this.contracts.reputation = new ethers.Contract(addresses.reputation, REPUTATION_ENGINE_ABI, this.provider);
    }
  }

  async getNetworkInfo() {
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    return {
      chainId: Number(network.chainId),
      name: network.name,
      blockNumber,
    };
  }

  async getTokenInfo() {
    if (!this.contracts.token) return null;
    const [name, symbol, totalSupply] = await Promise.all([
      this.contracts.token.name(),
      this.contracts.token.symbol(),
      this.contracts.token.totalSupply(),
    ]);
    return {
      name,
      symbol,
      totalSupply: ethers.formatEther(totalSupply),
      address: await this.contracts.token.getAddress(),
    };
  }

  async getBalance(address) {
    if (!this.contracts.token) return "0";
    const bal = await this.contracts.token.balanceOf(address);
    return ethers.formatEther(bal);
  }

  async getAllAgents() {
    if (!this.contracts.registry) return [];
    const count = await this.contracts.registry.nextAgentId();
    const agents = [];
    for (let i = 0; i < Number(count); i++) {
      const agent = await this.contracts.registry.getAgent(i);
      agents.push({
        id: i,
        name: agent.name,
        metadataURI: agent.metadataURI,
        owner: agent.owner,
        isActive: agent.isActive,
        registeredAt: Number(agent.registeredAt),
      });
    }
    return agents;
  }

  async getAgent(id) {
    if (!this.contracts.registry) return null;
    const agent = await this.contracts.registry.getAgent(id);
    return {
      id,
      name: agent.name,
      metadataURI: agent.metadataURI,
      owner: agent.owner,
      isActive: agent.isActive,
      registeredAt: Number(agent.registeredAt),
    };
  }

  async getAllMissions() {
    if (!this.contracts.missions) return [];
    const count = await this.contracts.missions.nextMissionId();
    const missions = [];
    for (let i = 0; i < Number(count); i++) {
      const m = await this.contracts.missions.getMission(i);
      missions.push({
        id: i,
        title: m.title,
        description: m.description,
        creator: m.creator,
        reward: ethers.formatEther(m.reward),
        assignedAgentId: Number(m.assignedAgentId),
        status: Number(m.status),
        createdAt: Number(m.createdAt),
        completedAt: Number(m.completedAt),
      });
    }
    return missions;
  }

  async getReputation(agentId) {
    if (!this.contracts.reputation) return null;
    const rep = await this.contracts.reputation.getReputation(agentId);
    return {
      agentId,
      totalMissions: Number(rep.totalMissions),
      completedMissions: Number(rep.completedMissions),
      failedMissions: Number(rep.failedMissions),
      score: Number(rep.score),
      scorePercent: (Number(rep.score) / 100).toFixed(2) + "%",
      lastUpdated: Number(rep.lastUpdated),
    };
  }
}

module.exports = { BlockchainService };
