import { createPublicClient, http, type PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { ABIS } from './constants';
import type { Agent, Mission, Reputation, AvairaConfig } from './types';

export class AvairaSDK {
  private client: PublicClient;
  private config: AvairaConfig;

  constructor(config: AvairaConfig) {
    this.config = config;
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http(config.rpcUrl),
    });
  }

  // ====== Agent Registry ======

  async getAgentCount(): Promise<number> {
    const count = await this.client.readContract({
      address: this.config.contracts.registry,
      abi: ABIS.AgentRegistry,
      functionName: 'nextAgentId',
    });
    return Number(count);
  }

  async getAgent(id: number): Promise<Agent> {
    const result = await this.client.readContract({
      address: this.config.contracts.registry,
      abi: ABIS.AgentRegistry,
      functionName: 'getAgent',
      args: [BigInt(id)],
    });
    return {
      id,
      name: result.name,
      metadataURI: result.metadataURI,
      owner: result.owner,
      isActive: result.isActive,
      registeredAt: Number(result.registeredAt),
    };
  }

  async getAllAgents(): Promise<Agent[]> {
    const count = await this.getAgentCount();
    const agents: Agent[] = [];
    for (let i = 0; i < count; i++) {
      agents.push(await this.getAgent(i));
    }
    return agents;
  }

  // ====== Mission Manager ======

  async getMissionCount(): Promise<number> {
    const count = await this.client.readContract({
      address: this.config.contracts.missionManager,
      abi: ABIS.MissionManager,
      functionName: 'nextMissionId',
    });
    return Number(count);
  }

  async getMission(id: number): Promise<Mission> {
    const result = await this.client.readContract({
      address: this.config.contracts.missionManager,
      abi: ABIS.MissionManager,
      functionName: 'getMission',
      args: [BigInt(id)],
    });
    return {
      id,
      title: result.title,
      description: result.description,
      creator: result.creator,
      reward: result.reward,
      assignedAgentId: Number(result.assignedAgentId),
      status: Number(result.status),
      createdAt: Number(result.createdAt),
      completedAt: Number(result.completedAt),
    };
  }

  async getAllMissions(): Promise<Mission[]> {
    const count = await this.getMissionCount();
    const missions: Mission[] = [];
    for (let i = 0; i < count; i++) {
      missions.push(await this.getMission(i));
    }
    return missions;
  }

  // ====== Reputation Engine ======

  async getReputation(agentId: number): Promise<Reputation> {
    const result = await this.client.readContract({
      address: this.config.contracts.reputation,
      abi: ABIS.ReputationEngine,
      functionName: 'getReputation',
      args: [BigInt(agentId)],
    });
    return {
      agentId,
      totalMissions: Number(result.totalMissions),
      completedMissions: Number(result.completedMissions),
      failedMissions: Number(result.failedMissions),
      score: Number(result.score),
      lastUpdated: Number(result.lastUpdated),
    };
  }

  async getReputationScore(agentId: number): Promise<number> {
    const score = await this.client.readContract({
      address: this.config.contracts.reputation,
      abi: ABIS.ReputationEngine,
      functionName: 'getScore',
      args: [BigInt(agentId)],
    });
    return Number(score);
  }

  // ====== Token ======

  async getTokenBalance(address: `0x${string}`): Promise<bigint> {
    return this.client.readContract({
      address: this.config.contracts.token,
      abi: ABIS.AvairaToken,
      functionName: 'balanceOf',
      args: [address],
    });
  }

  async getTotalSupply(): Promise<bigint> {
    return this.client.readContract({
      address: this.config.contracts.token,
      abi: ABIS.AvairaToken,
      functionName: 'totalSupply',
    });
  }
}
