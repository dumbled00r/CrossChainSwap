import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import { Chain } from "./constants/chains";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY || "";
const apiKey = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: Chain.AVALANCHE,
  networks: {
    ethereum: {
      chainId: 11155111,
      gasMultiplier: 2,
      url: "https://rpc-sepolia.rockx.com",
      accounts: [privateKey],
    },
    avalanche: {
      chainId: 43113,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [privateKey],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      sepolia: apiKey,
    },
  },
};

export default config;
