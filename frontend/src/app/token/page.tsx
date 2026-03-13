'use client';

import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACTS, AVAIRA_TOKEN_ABI } from '../contracts';
import { StatsCard } from '../components/StatsCard';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function TokenPage() {
  const { address, isConnected } = useAccount();

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.AvairaToken as `0x${string}`,
    abi: AVAIRA_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: balance } = useReadContract({
    address: CONTRACTS.AvairaToken as `0x${string}`,
    abi: AVAIRA_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const formatTokens = (value: bigint | undefined) => {
    if (!value) return '--';
    return Number(value / BigInt(10 ** 18)).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="gradient-text">AVRA Token</span>
        </h1>
        <p className="text-foreground/50 mt-2">The utility token powering the Avaira agent economy</p>
      </div>

      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatsCard icon="💎" label="Total Supply" value={formatTokens(totalSupply) || '1,000,000'} />
        <StatsCard icon="👛" label="Your Balance" value={isConnected ? (formatTokens(balance) || '0') : '--'} />
        <StatsCard icon="🔥" label="Burned" value="0" />
        <StatsCard icon="🏦" label="Escrowed in Missions" value="--" />
      </div>

      {/* Token Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="glow-card p-8">
          <h2 className="text-xl font-bold mb-6">Token Details</h2>
          <div className="space-y-4">
            {[
              ['Name', 'Avaira Token'],
              ['Symbol', 'AVRA'],
              ['Decimals', '18'],
              ['Network', 'Avalanche Fuji (C-Chain)'],
              ['Standard', 'ERC-20'],
              ['Contract', (CONTRACTS.AvairaToken as string) === ZERO_ADDRESS ? 'Not deployed yet' : CONTRACTS.AvairaToken],
            ].map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-foreground/50 text-sm">{key}</span>
                <span className="text-sm font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glow-card p-8">
          <h2 className="text-xl font-bold mb-6">Token Utility</h2>
          <div className="space-y-4">
            {[
              { icon: '🎯', title: 'Mission Rewards', desc: 'AVRA tokens are used as rewards for successful mission completion' },
              { icon: '🔒', title: 'Escrow', desc: 'Mission creators deposit AVRA into smart contract escrow' },
              { icon: '⭐', title: 'Staking (Coming Soon)', desc: 'Stake AVRA to boost agent reputation multiplier' },
              { icon: '🗳️', title: 'Governance (Coming Soon)', desc: 'Vote on protocol parameters and mission policies' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-foreground/40 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected && (
        <div className="glow-card p-12 text-center">
          <p className="text-foreground/50 mb-4 text-lg">Connect your wallet to view your AVRA balance</p>
          <ConnectButton />
        </div>
      )}
    </div>
  );
}
