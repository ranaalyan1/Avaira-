'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACTS, MISSION_MANAGER_ABI, AVAIRA_TOKEN_ABI } from '../contracts';
import { MissionCard, type MissionData } from '../components/MissionCard';

export default function MissionsPage() {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [step, setStep] = useState<'approve' | 'create'>('approve');

  const { writeContract: writeApprove, data: approveTx, isPending: isApproving } = useWriteContract();
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTx });

  const { writeContract: writeCreate, data: createTx, isPending: isCreating } = useWriteContract();
  const { isLoading: createConfirming, isSuccess: createConfirmed } = useWaitForTransactionReceipt({ hash: createTx });

  const { data: nextMissionId } = useReadContract({
    address: CONTRACTS.MissionManager as `0x${string}`,
    abi: MISSION_MANAGER_ABI,
    functionName: 'nextMissionId',
  });

  const missionCount = nextMissionId ? Number(nextMissionId) : 0;

  const handleApprove = () => {
    if (!reward || Number(reward) <= 0) return;
    writeApprove({
      address: CONTRACTS.AvairaToken as `0x${string}`,
      abi: AVAIRA_TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS.MissionManager as `0x${string}`, parseEther(reward)],
    });
    setStep('create');
  };

  const handleCreate = () => {
    if (!title.trim() || !reward) return;
    writeCreate({
      address: CONTRACTS.MissionManager as `0x${string}`,
      abi: MISSION_MANAGER_ABI,
      functionName: 'createMission',
      args: [title, description, parseEther(reward)],
    });
  };

  // Demo missions
  const demoMissions: MissionData[] = [
    { id: 0, title: 'Monitor DeFi Pool Health', description: 'Continuously monitor liquidity pool ratios and alert on significant imbalances across major Avalanche DEXs.', reward: '500', status: 1, assignedAgentId: 0, creator: '0xfE41a699590fd5C355392728919E9317F425F932' },
    { id: 1, title: 'Scan for Smart Contract Vulnerabilities', description: 'Analyze newly deployed contracts on Avalanche for common vulnerability patterns.', reward: '1,000', status: 0, assignedAgentId: 0, creator: '0x1234567890abcdef1234567890abcdef12345678' },
    { id: 2, title: 'Cross-chain Bridge Monitoring', description: 'Monitor bridge transactions for anomalies and suspicious patterns in real-time.', reward: '750', status: 2, assignedAgentId: 1, creator: '0xfE41a699590fd5C355392728919E9317F425F932' },
    { id: 3, title: 'NFT Market Analysis', description: 'Track NFT marketplace trends, floor prices, and volume across Avalanche collections.', reward: '250', status: 0, assignedAgentId: 0, creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
    { id: 4, title: 'Governance Proposal Tracking', description: 'Monitor and summarize governance proposals across Avalanche DAOs for stakeholders.', reward: '300', status: 3, assignedAgentId: 2, creator: '0x1234567890abcdef1234567890abcdef12345678' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">Mission Control</span>
          </h1>
          <p className="text-foreground/50 mt-2">Create, assign, and track agent missions with AVRA rewards</p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-2xl font-bold">{missionCount || demoMissions.length}</p>
            <p className="text-sm text-foreground/40">Total Missions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">2,800</p>
            <p className="text-sm text-foreground/40">AVRA Escrowed</p>
          </div>
        </div>
      </div>

      {/* Create Mission Form */}
      <div className="glow-card p-8 mb-10">
        <h2 className="text-xl font-bold mb-6">Create New Mission</h2>
        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-foreground/50 mb-4">Connect your wallet to create a mission</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Mission Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monitor DeFi Pool Health"
                  className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  maxLength={128}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Reward (AVRA)</label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="100"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the mission requirements and expected outcomes..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                maxLength={1024}
              />
            </div>
            <div className="flex gap-3">
              {step === 'approve' ? (
                <button
                  onClick={handleApprove}
                  disabled={!title.trim() || !reward || Number(reward) <= 0 || isApproving}
                  className="px-8 py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  {isApproving ? 'Approving...' : '1. Approve AVRA'}
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={!title.trim() || !reward || isCreating || createConfirming}
                  className="px-8 py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  {isCreating ? 'Confirming...' : createConfirming ? 'Creating...' : '2. Create Mission'}
                </button>
              )}
            </div>
            {createConfirmed && (
              <p className="text-success text-sm">Mission created successfully!</p>
            )}
          </div>
        )}
      </div>

      {/* Mission Filters */}
      <div className="flex items-center gap-2 mb-6">
        {['All', 'Open', 'Assigned', 'Completed', 'Failed'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-1.5 rounded-lg text-sm bg-surface-2 border border-border text-foreground/60 hover:text-foreground hover:border-accent/50 transition-all"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mission List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}
