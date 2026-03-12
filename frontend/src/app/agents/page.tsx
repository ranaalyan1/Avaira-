'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACTS, AGENT_REGISTRY_ABI } from '../contracts';
import { AgentCard, type AgentData } from '../components/AgentCard';

export default function AgentsPage() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [metadataURI, setMetadataURI] = useState('');

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: nextAgentId } = useReadContract({
    address: CONTRACTS.AgentRegistry as `0x${string}`,
    abi: AGENT_REGISTRY_ABI,
    functionName: 'nextAgentId',
  });

  const agentCount = nextAgentId ? Number(nextAgentId) : 0;

  const handleRegister = () => {
    if (!name.trim()) return;
    writeContract({
      address: CONTRACTS.AgentRegistry as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: 'registerAgent',
      args: [name, metadataURI || `avaira://agent/${name.toLowerCase().replace(/\s/g, '-')}`],
    });
  };

  // Demo agents for display when contracts aren't deployed
  const demoAgents: AgentData[] = [
    { id: 0, name: 'Scout Alpha', metadataURI: 'avaira://agent/scout-alpha', owner: '0xfE41a699590fd5C355392728919E9317F425F932', isActive: true, registeredAt: 1710000000 },
    { id: 1, name: 'Sentinel Beta', metadataURI: 'avaira://agent/sentinel-beta', owner: '0x1234567890abcdef1234567890abcdef12345678', isActive: true, registeredAt: 1710100000 },
    { id: 2, name: 'Oracle Gamma', metadataURI: 'avaira://agent/oracle-gamma', owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', isActive: false, registeredAt: 1710200000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">Agent Registry</span>
          </h1>
          <p className="text-foreground/50 mt-2">Register and manage autonomous AI agents on-chain</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{agentCount || demoAgents.length}</p>
          <p className="text-sm text-foreground/40">Registered Agents</p>
        </div>
      </div>

      {/* Register Agent Form */}
      <div className="glow-card p-8 mb-10">
        <h2 className="text-xl font-bold mb-6">Register New Agent</h2>
        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-foreground/50 mb-4">Connect your wallet to register an agent</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Scout Alpha"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                maxLength={64}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Metadata URI (optional)</label>
              <input
                type="text"
                value={metadataURI}
                onChange={(e) => setMetadataURI(e.target.value)}
                placeholder="ipfs://... or https://..."
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                maxLength={256}
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={!name.trim() || isPending || isConfirming}
              className="px-8 py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
            >
              {isPending ? 'Confirming...' : isConfirming ? 'Registering...' : 'Register Agent'}
            </button>
            {isSuccess && (
              <p className="text-success text-sm">Agent registered successfully!</p>
            )}
          </div>
        )}
      </div>

      {/* Agent List */}
      <h2 className="text-xl font-bold mb-6">All Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
