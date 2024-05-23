import { ethers } from "ethers";
import uniswapRouterAbi from "../constants/abis/UniswapV2Router02.json";
import pangolinRouterAbi from "../constants/abis/PangolinRouter.json";
import {
  ChainIdToName,
  ChainToRPC,
  WrappedTokenName,
} from "@/constants/chains";
import { WRAPPED_NATIVE_ASSET, USDC } from "@/constants/addresses";

export type SwapEstimateOutputPayload = {
  routerAddress: string;
  chainId: number;
  amount: string;
  nativeToErc20: boolean;
};

export async function estimateSwapOutputAmount(
  payload: SwapEstimateOutputPayload
) {
  const { routerAddress, chainId, amount, nativeToErc20 } = payload;
  const provider = new ethers.JsonRpcProvider(
    ChainToRPC[ChainIdToName[chainId]]
  );
  const contract = new ethers.Contract(
    routerAddress,
    pangolinRouterAbi,
    provider
  );
  try {
    const path = nativeToErc20
      ? [
          WRAPPED_NATIVE_ASSET[ChainIdToName[chainId]],
          USDC[ChainIdToName[chainId]],
        ]
      : [
          USDC[ChainIdToName[chainId]],
          WRAPPED_NATIVE_ASSET[ChainIdToName[chainId]],
        ];
    const amountOuts = await contract.getAmountsOut(amount, path);
    return amountOuts[amountOuts.length - 1].toString();
  } catch (e: any) {
    console.log(e);
    // let errMsg = `No ${WrappedTokenName[ChainIdToName[chainId]]} liquidity at ${
    //   ChainIdToName[chainId]
    // }`;
    // if (e.message.indexOf("out-of-bounds") > -1) {
    //   errMsg = "Swap amount is too low";
    // }
    // throw new Error(errMsg);
  }
}
