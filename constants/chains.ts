import { GasToken } from "@axelar-network/axelarjs-sdk";

export enum Chain {
  AVALANCHE = "avalanche",
  ETHEREUM = "ethereum",
}

export const GMPChainId = {
  [Chain.AVALANCHE]: "Avalanche",
  [Chain.ETHEREUM]: "ethereum-sepolia",
};

export const NativeToken = {
  [Chain.AVALANCHE]: GasToken.AVAX,
  [Chain.ETHEREUM]: GasToken.ETH,
};
