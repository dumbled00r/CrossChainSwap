import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
} from "@axelar-network/axelarjs-sdk";

import { NativeToken, Chain, GMPChainId } from "../constants/chains";
import { ethers } from "ethers";
export const estimateFee: (
  chainName: Chain,
  destinationChain: Chain,
  amount?: string
) => Promise<string> = async (chainName, destinationChain, amount) => {
  const destinationChainId = GMPChainId[destinationChain as Chain];
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const gasFee = await api.estimateGasFee(
    chainName as unknown as EvmChain,
    destinationChainId as unknown as EvmChain,
    NativeToken[chainName],
    250000
  );

  return ethers.formatEther(gasFee).toString().substring(0, 10);
};
