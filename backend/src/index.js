require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { BlockchainService } = require("./blockchain");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Initialize blockchain service
const blockchain = new BlockchainService();
blockchain.init();

// ============ ROUTES ============

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    const network = await blockchain.getNetworkInfo();
    res.json({ status: "ok", ...network });
  } catch {
    res.status(503).json({ status: "error", message: "Blockchain connection failed" });
  }
});

// Protocol overview
app.get("/api/overview", async (_req, res) => {
  try {
    const [network, token, agents, missions] = await Promise.all([
      blockchain.getNetworkInfo(),
      blockchain.getTokenInfo(),
      blockchain.getAllAgents().catch(() => []),
      blockchain.getAllMissions().catch(() => []),
    ]);

    res.json({
      network,
      token,
      stats: {
        totalAgents: agents.length,
        activeAgents: agents.filter((a) => a.isActive).length,
        totalMissions: missions.length,
        openMissions: missions.filter((m) => m.status === 0).length,
        completedMissions: missions.filter((m) => m.status === 2).length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overview" });
  }
});

// Token info
app.get("/api/token", async (_req, res) => {
  try {
    const info = await blockchain.getTokenInfo();
    res.json(info || { message: "Token contract not deployed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token info" });
  }
});

// Token balance
app.get("/api/token/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }
    const balance = await blockchain.getBalance(address);
    res.json({ address, balance });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// All agents
app.get("/api/agents", async (_req, res) => {
  try {
    const agents = await blockchain.getAllAgents();
    res.json({ agents, total: agents.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

// Single agent
app.get("/api/agents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0) return res.status(400).json({ error: "Invalid agent ID" });
    const agent = await blockchain.getAgent(id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agent" });
  }
});

// Agent reputation
app.get("/api/agents/:id/reputation", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0) return res.status(400).json({ error: "Invalid agent ID" });
    const rep = await blockchain.getReputation(id);
    res.json(rep || { message: "Reputation contract not deployed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reputation" });
  }
});

// All missions
app.get("/api/missions", async (_req, res) => {
  try {
    const missions = await blockchain.getAllMissions();
    res.json({ missions, total: missions.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch missions" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Avaira Backend API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
