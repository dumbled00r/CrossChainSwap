import { task } from "hardhat/config";
import {
  CROSSCHAIN_NATIVE_SWAP,
  USDC,
  WRAPPED_NATIVE_ASSET,
} from "../constants/address";
import { NativeToken, Chain, GMPChainId } from "../constants/chains";
import crosschainNativeSwapAbi from "../constants/abi/CrosschainNativeSwap.json";
import { createDestTradeData, createSrcTradeData } from "./utils/createSwap";
import { v4 as uuidv4 } from "uuid";
import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
} from "@axelar-network/axelarjs-sdk";
import { isValidChain } from "./utils/validateChain";
import { relayUSDC } from "./utils/usdcRelayer";

task(
  "tradeSendTrade",
  "call tradeSendTrade function on the CircleSwapExecutable contract"
)
  .addPositionalParam("amount")
  .addPositionalParam("destinationChain")
  .setAction(async (taskArgs, hre) => {
    const { amount, destinationChain } = taskArgs;
    const chainName = hre.network.name as Chain;
    if (!isValidChain(chainName))
      return console.log(
        `Supported only ${Chain.ETHEREUM} and ${Chain.AVALANCHE}`
      );
    if (!isValidChain(destinationChain))
      return console.log(
        `Supported only ${Chain.ETHEREUM} and ${Chain.AVALANCHE}`
      );

    const destinationChainId = GMPChainId[destinationChain as Chain];
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
    const gasFee = await api.estimateGasFee(
      chainName as unknown as EvmChain,
      destinationChainId as unknown as EvmChain,
      NativeToken[chainName],
      250000
    );
    const ethers = hre.ethers;
    console.log(
      `Total fee for ${chainName} to ${destinationChain}:`,
      ethers.formatEther(gasFee),
      NativeToken[chainName]
    );
    const [deployer] = await ethers.getSigners();

    const srcUsdcAddress = USDC[chainName];
    const destUsdcAddress = USDC[destinationChain as Chain];
    const subunitAmount = ethers.parseEther(amount);
    console.log(subunitAmount);
    // Step 1: Create the tradeData for the trade
    const tradeDataSrc = createSrcTradeData(
      [WRAPPED_NATIVE_ASSET[chainName], srcUsdcAddress],
      chainName,
      CROSSCHAIN_NATIVE_SWAP[chainName],
      subunitAmount
    );
    const tradeDataDest = createDestTradeData(
      [destUsdcAddress, WRAPPED_NATIVE_ASSET[destinationChain as Chain]],
      destinationChain,
      deployer.address,
      "0",
      destUsdcAddress
    );
    const traceId = ethers.id(uuidv4());
    const fallbackRecipient = deployer.address;

    // length of tradeData (32) + token in (32) + amount in (32) + router (32) + length of data (32) + 36
    const inputPos = 196;
    // Step 2: Send the trade to CircleSwapExecutable
    const contract = new ethers.Contract(
      CROSSCHAIN_NATIVE_SWAP[chainName],
      crosschainNativeSwapAbi,
      deployer
    );

    const tx = await contract
      .nativeTradeSendTrade(
        destinationChainId,
        tradeDataSrc,
        tradeDataDest,
        traceId,
        fallbackRecipient,
        inputPos,
        {
          value: subunitAmount + BigInt(gasFee),
          gasLimit: 1000000,
        }
      )
      .then((tx: any) => tx.wait());

    console.log("Tx Hash:", tx.hash);

    // Step 3: Relay the USDC to destination chain
    await relayUSDC(tx.hash, chainName, deployer);

    console.log(
      "Continue tracking at",
      `https://testnet.axelarscan.io/gmp/${tx.hash}`
    );
  });

//10000000000n
//10000000000225319430265931

//successful transaction:
// https://testnet.axelarscan.io/gmp/0x1fd57655fd7cf7e2ce3a492592fa90adfb5262cdcd360667c5b3bd0c641bef61
// https://sepolia.etherscan.io/tx/0x3f7e87d7f96ef05fe0bb33c95217ab3e8a260586a7889f5da84cf6e54ad704d9
