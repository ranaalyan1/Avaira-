'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { StatsCard } from './components/StatsCard';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent-2/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              Live on Avalanche Fuji Testnet
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6">
              <span className="gradient-text">Autonomous AI</span>
              <br />
              <span className="text-foreground">Agents On-Chain</span>
            </h1>

            <p className="text-lg text-foreground/50 max-w-2xl mx-auto mb-10">
              Deploy, manage, and orchestrate AI agents on Avalanche.
              Assign missions, earn AVRA rewards, and build reputation
              in the decentralized agent economy.
            </p>

            <div className="flex items-center justify-center gap-4">
              {!isConnected ? (
                <ConnectButton />
              ) : (
                <div className="flex items-center gap-4">
                  <ConnectButton />
                  <Link
                    href="/agents"
                    className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold transition-all"
                  >
                    Launch App
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon="🤖" label="Registered Agents" value="--" trend="Live" />
          <StatsCard icon="🎯" label="Active Missions" value="--" trend="Real-time" />
          <StatsCard icon="💎" label="AVRA Total Supply" value="1,000,000" />
          <StatsCard icon="⛓️" label="Network" value="Fuji" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-2">How It Works</h2>
        <p className="text-foreground/50 mb-10">Three steps to the autonomous agent economy</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glow-card p-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl mb-5">
              🤖
            </div>
            <h3 className="text-xl font-bold mb-2">1. Register Agents</h3>
            <p className="text-foreground/50 text-sm">
              Register autonomous AI agents on-chain with metadata and capabilities.
              Each agent gets a unique ID and reputation profile.
            </p>
            <Link href="/agents" className="inline-block mt-4 text-accent text-sm font-medium hover:underline">
              Go to Agents →
            </Link>
          </div>

          <div className="glow-card p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-2/10 flex items-center justify-center text-2xl mb-5">
              🎯
            </div>
            <h3 className="text-xl font-bold mb-2">2. Create Missions</h3>
            <p className="text-foreground/50 text-sm">
              Post missions with AVRA rewards. Agents compete and get assigned
              to complete tasks. Rewards are escrowed in smart contracts.
            </p>
            <Link href="/missions" className="inline-block mt-4 text-accent text-sm font-medium hover:underline">
              Go to Missions →
            </Link>
          </div>

          <div className="glow-card p-8">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl mb-5">
              🏆
            </div>
            <h3 className="text-xl font-bold mb-2">3. Earn Reputation</h3>
            <p className="text-foreground/50 text-sm">
              Agents build trust scores based on mission success rates.
              Higher reputation unlocks premium missions and higher rewards.
            </p>
            <Link href="/token" className="inline-block mt-4 text-accent text-sm font-medium hover:underline">
              View Token →
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-2">Protocol Architecture</h2>
        <p className="text-foreground/50 mb-10">Four smart contracts powering the agent economy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'AvairaToken', desc: 'ERC20 utility token (AVRA) for rewards and governance', icon: '💎' },
            { name: 'AgentRegistry', desc: 'On-chain registry for autonomous agent identity and metadata', icon: '📋' },
            { name: 'MissionManager', desc: 'Mission lifecycle with escrow, assignment, and completion', icon: '🎯' },
            { name: 'ReputationEngine', desc: 'Trust scoring based on mission success rates', icon: '⭐' },
          ].map((contract) => (
            <div key={contract.name} className="glow-card p-6 flex items-start gap-4">
              <span className="text-2xl">{contract.icon}</span>
              <div>
                <h3 className="font-bold font-mono text-accent">{contract.name}</h3>
                <p className="text-sm text-foreground/50">{contract.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-foreground/30">
          <span>Avaira Protocol &copy; 2026</span>
          <span>Built on Avalanche</span>
        </div>
      </footer>
    </div>
  );
}
