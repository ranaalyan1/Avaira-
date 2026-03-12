const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MissionManager", function () {
  let token, missionManager, owner, creator, agent;

  beforeEach(async function () {
    [owner, creator, agent] = await ethers.getSigners();

    const AvairaToken = await ethers.getContractFactory("AvairaToken");
    token = await AvairaToken.deploy(owner.address);
    await token.waitForDeployment();

    const MissionManager = await ethers.getContractFactory("MissionManager");
    missionManager = await MissionManager.deploy(owner.address, await token.getAddress());
    await missionManager.waitForDeployment();

    // Give creator tokens and approve MissionManager
    await token.mint(creator.address, ethers.parseEther("10000"));
    await token.connect(creator).approve(await missionManager.getAddress(), ethers.parseEther("10000"));
  });

  it("should create a mission with escrow", async function () {
    await missionManager.connect(creator).createMission("Scan Network", "Monitor events", ethers.parseEther("100"));
    const mission = await missionManager.getMission(0);
    expect(mission.title).to.equal("Scan Network");
    expect(mission.reward).to.equal(ethers.parseEther("100"));
    expect(mission.status).to.equal(0); // Open
  });

  it("should emit MissionCreated event", async function () {
    await expect(
      missionManager.connect(creator).createMission("Scan", "Desc", ethers.parseEther("50"))
    ).to.emit(missionManager, "MissionCreated")
      .withArgs(0, "Scan", creator.address, ethers.parseEther("50"));
  });

  it("should assign mission to agent", async function () {
    await missionManager.connect(creator).createMission("Task", "Desc", ethers.parseEther("100"));
    await missionManager.connect(creator).assignMission(0, 1);
    const mission = await missionManager.getMission(0);
    expect(mission.assignedAgentId).to.equal(1);
    expect(mission.status).to.equal(1); // Assigned
  });

  it("should complete mission", async function () {
    await missionManager.connect(creator).createMission("Task", "Desc", ethers.parseEther("100"));
    await missionManager.connect(creator).assignMission(0, 1);
    await missionManager.connect(owner).completeMission(0);
    const mission = await missionManager.getMission(0);
    expect(mission.status).to.equal(2); // Completed
  });

  it("should refund on failed mission", async function () {
    await missionManager.connect(creator).createMission("Task", "Desc", ethers.parseEther("100"));
    await missionManager.connect(creator).assignMission(0, 1);

    const balBefore = await token.balanceOf(creator.address);
    await missionManager.connect(owner).failMission(0);
    const balAfter = await token.balanceOf(creator.address);

    expect(balAfter - balBefore).to.equal(ethers.parseEther("100"));
  });

  it("should cancel open mission and refund", async function () {
    await missionManager.connect(creator).createMission("Task", "Desc", ethers.parseEther("100"));
    const balBefore = await token.balanceOf(creator.address);
    await missionManager.connect(creator).cancelMission(0);
    const balAfter = await token.balanceOf(creator.address);
    expect(balAfter - balBefore).to.equal(ethers.parseEther("100"));
  });

  it("should reject zero reward", async function () {
    await expect(
      missionManager.connect(creator).createMission("Task", "Desc", 0)
    ).to.be.revertedWith("Reward must be > 0");
  });
});
