import { GasToken } from "@axelar-network/axelarjs-sdk";

export enum Chain {
  AVALANCHE = "avalanche",
  ETHEREUM = "ethereum",
}

export const ChainIdToName: { [key: number]: Chain } = {
  11155111: Chain.ETHEREUM,
  43113: Chain.AVALANCHE,
};

export const ChainToId: { [key in Chain]: number } = {
  [Chain.AVALANCHE]: 43113,
  [Chain.ETHEREUM]: 11155111,
};

export const ChainToRPC = {
  [Chain.AVALANCHE]: "https://api.avax-test.network/ext/bc/C/rpc",
  [Chain.ETHEREUM]: "https://rpc-sepolia.rockx.com",
};

export const GMPChainId = {
  [Chain.AVALANCHE]: "avalanche",
  [Chain.ETHEREUM]: "ethereum-sepolia",
};

export const NativeToken = {
  [Chain.AVALANCHE]: GasToken.AVAX,
  [Chain.ETHEREUM]: GasToken.ETH,
};

export const WrappedTokenName = {
  [Chain.AVALANCHE]: "Wrapped AVAX",
  [Chain.ETHEREUM]: "Wrapped ETH",
};
