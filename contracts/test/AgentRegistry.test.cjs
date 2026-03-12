const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentRegistry", function () {
  let registry, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    registry = await AgentRegistry.deploy(owner.address);
    await registry.waitForDeployment();
  });

  it("should register an agent", async function () {
    await registry.connect(addr1).registerAgent("Agent Alpha", "ipfs://metadata1");
    const agent = await registry.getAgent(0);
    expect(agent.name).to.equal("Agent Alpha");
    expect(agent.owner).to.equal(addr1.address);
    expect(agent.isActive).to.be.true;
  });

  it("should increment agent IDs", async function () {
    await registry.connect(addr1).registerAgent("Agent 1", "ipfs://1");
    await registry.connect(addr2).registerAgent("Agent 2", "ipfs://2");
    expect(await registry.nextAgentId()).to.equal(2);
  });

  it("should emit AgentRegistered event", async function () {
    await expect(registry.connect(addr1).registerAgent("Agent Alpha", "ipfs://1"))
      .to.emit(registry, "AgentRegistered")
      .withArgs(0, "Agent Alpha", addr1.address);
  });

  it("should toggle agent status", async function () {
    await registry.connect(addr1).registerAgent("Agent Alpha", "ipfs://1");
    await registry.connect(addr1).toggleAgentStatus(0);
    const agent = await registry.getAgent(0);
    expect(agent.isActive).to.be.false;
  });

  it("should reject toggle from non-owner", async function () {
    await registry.connect(addr1).registerAgent("Agent Alpha", "ipfs://1");
    await expect(registry.connect(addr2).toggleAgentStatus(0))
      .to.be.revertedWith("Not the owner");
  });
});
