import { task } from "hardhat/config";
import {
  CROSSCHAIN_NATIVE_SWAP,
  USDC,
  WRAPPED_NATIVE_ASSET,
} from "../constants/addresses";
import { NativeToken, Chain, GMPChainId } from "../constants/chains";
import crosschainNativeSwapAbi from "../../constants/abi/CrosschainNativeSwap.json";
import { createDestTradeData, createSrcTradeData } from "./swap/createSwap";
import { v4 as uuidv4 } from "uuid";
import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
} from "@axelar-network/axelarjs-sdk";
import { relayUSDC } from "./swap/relayUSDC";
import { ethers } from "ethers";

export type SendTradePayload = {
  amount: string;
  srcChain: Chain;
  destChain: Chain;
  address: string;
};

export async function prepareSendTrade(payload: SendTradePayload) {
  const { amount, srcChain, destChain, address } = payload;
  const srcCrossChainSwapAddress = CROSSCHAIN_NATIVE_SWAP[srcChain];
  const srcAssetsAddress = WRAPPED_NATIVE_ASSET[srcChain];
  const srcUsdcAddress = USDC[srcChain];
  const chainName = srcChain;

  const subunitAmount = ethers.parseEther(amount);

  // Create the trade data for the source chain
  const tradeDataSrc = createSrcTradeData(
    [srcAssetsAddress, srcUsdcAddress],
    srcChain,
    srcCrossChainSwapAddress,
    subunitAmount
  );

  const destAssetsAddress = WRAPPED_NATIVE_ASSET[destChain];
  const destUsdcAddress = USDC[destChain];

  // Create the trade data for the destination chain
  const tradeDataDest = createDestTradeData(
    [destUsdcAddress, destAssetsAddress],
    destChain,
    address,
    "0",
    destUsdcAddress
  );

  // Get trace id
  const traceId = ethers.id(uuidv4());
  const fallbackRecipient = address;

  // Data length: 32 + token in: 32 + amount in: 32 + router: 32 + data length: 32 + 36
  const inputPos = 196;
  const destChainId = GMPChainId[destChain as Chain];
  return {
    srcCrossChainSwapAddress,
    crosschainNativeSwapAbi,
    chainName,
    subunitAmount,
    destChainId,
    tradeDataSrc,
    tradeDataDest,
    traceId,
    fallbackRecipient,
    inputPos,
  };
}
//10000000000n
//10000000000225319430265931

//successful transaction:
// https://testnet.axelarscan.io/gmp/0x1fd57655fd7cf7e2ce3a492592fa90adfb5262cdcd360667c5b3bd0c641bef61
// https://sepolia.etherscan.io/tx/0x3f7e87d7f96ef05fe0bb33c95217ab3e8a260586a7889f5da84cf6e54ad704d9
