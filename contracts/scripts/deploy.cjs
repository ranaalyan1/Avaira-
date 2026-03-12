const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const initialOwner = deployer.address;

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy AvairaToken
  console.log("\n--- Deploying AvairaToken ---");
  const AvairaToken = await hre.ethers.getContractFactory("AvairaToken");
  const token = await AvairaToken.deploy(initialOwner);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("AvairaToken deployed to:", tokenAddress);

  // 2. Deploy AgentRegistry
  console.log("\n--- Deploying AgentRegistry ---");
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy(initialOwner);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("AgentRegistry deployed to:", registryAddress);

  // 3. Deploy ReputationEngine
  console.log("\n--- Deploying ReputationEngine ---");
  const ReputationEngine = await hre.ethers.getContractFactory("ReputationEngine");
  const reputation = await ReputationEngine.deploy(initialOwner);
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("ReputationEngine deployed to:", reputationAddress);

  // 4. Deploy MissionManager
  console.log("\n--- Deploying MissionManager ---");
  const MissionManager = await hre.ethers.getContractFactory("MissionManager");
  const missionManager = await MissionManager.deploy(initialOwner, tokenAddress);
  await missionManager.waitForDeployment();
  const missionManagerAddress = await missionManager.getAddress();
  console.log("MissionManager deployed to:", missionManagerAddress);

  // Save deployment addresses
  const addresses = {
    network: "fuji",
    chainId: 43113,
    deployer: deployer.address,
    contracts: {
      AvairaToken: tokenAddress,
      AgentRegistry: registryAddress,
      ReputationEngine: reputationAddress,
      MissionManager: missionManagerAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(deploymentsDir, "fuji.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(addresses, null, 2));
  console.log("\nAddresses saved to deployments/fuji.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
