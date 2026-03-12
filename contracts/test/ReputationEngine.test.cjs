const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationEngine", function () {
  let reputation, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const ReputationEngine = await ethers.getContractFactory("ReputationEngine");
    reputation = await ReputationEngine.deploy(owner.address);
    await reputation.waitForDeployment();
  });

  it("should record successful mission", async function () {
    await reputation.recordMissionResult(0, true);
    const rep = await reputation.getReputation(0);
    expect(rep.totalMissions).to.equal(1);
    expect(rep.completedMissions).to.equal(1);
    expect(rep.score).to.equal(10000); // 100%
  });

  it("should record failed mission", async function () {
    await reputation.recordMissionResult(0, false);
    const rep = await reputation.getReputation(0);
    expect(rep.totalMissions).to.equal(1);
    expect(rep.failedMissions).to.equal(1);
    expect(rep.score).to.equal(0);
  });

  it("should calculate mixed score", async function () {
    await reputation.recordMissionResult(0, true);
    await reputation.recordMissionResult(0, true);
    await reputation.recordMissionResult(0, false);
    const score = await reputation.getScore(0);
    expect(score).to.equal(6666); // 66.66%
  });

  it("should check reliability", async function () {
    await reputation.recordMissionResult(0, true);
    await reputation.recordMissionResult(0, true);
    // Not reliable yet - only 2 missions
    expect(await reputation.isReliable(0, 5000)).to.be.false;
    await reputation.recordMissionResult(0, true);
    // Now reliable: 3 missions, 100% score
    expect(await reputation.isReliable(0, 5000)).to.be.true;
  });

  it("should emit events", async function () {
    await expect(reputation.recordMissionResult(0, true))
      .to.emit(reputation, "MissionRecorded")
      .withArgs(0, true);
  });
});
