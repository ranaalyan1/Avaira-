const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AvairaToken", function () {
  let token, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const AvairaToken = await ethers.getContractFactory("AvairaToken");
    token = await AvairaToken.deploy(owner.address);
    await token.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await token.name()).to.equal("Avaira Token");
    expect(await token.symbol()).to.equal("AVRA");
  });

  it("should mint initial supply to deployer", async function () {
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseEther("1000000"));
  });

  it("should allow owner to mint", async function () {
    await token.mint(addr1.address, ethers.parseEther("500"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
  });

  it("should reject mint from non-owner", async function () {
    await expect(
      token.connect(addr1).mint(addr1.address, ethers.parseEther("500"))
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });
});
