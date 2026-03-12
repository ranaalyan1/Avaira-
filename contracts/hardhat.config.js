require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "";

const accounts = (PRIVATE_KEY.length === 66 || PRIVATE_KEY.length === 64) 
  ? [PRIVATE_KEY] 
  : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      snowtrace: SNOWTRACE_API_KEY,
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io/",
        },
      },
    ],
  },
};
