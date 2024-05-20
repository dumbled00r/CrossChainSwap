import { task } from "hardhat/config";
import { CROSSCHAIN_NATIVE_SWAP, USDC } from "../constants/address";
import { Chain } from "../constants/chains";
import crosschainNativeSwapAbi from "../constants/abi/CrosschainNativeSwap.json";

task("inheritContract", "Add sibling contract")
  .addPositionalParam("siblingChain")
  .setAction(async (taskArgs, hre) => {
    const { siblingChain } = taskArgs;
    const ethers = hre.ethers;
    const [deployer] = await ethers.getSigners();
    const chainName = hre.network.name as Chain;
    const siblingChainName = siblingChain as Chain;

    console.log(siblingChain);

    if (!CROSSCHAIN_NATIVE_SWAP[siblingChainName]) return; // if not deployed

    const contract = new ethers.Contract(
      CROSSCHAIN_NATIVE_SWAP[chainName],
      crosschainNativeSwapAbi,
      deployer
    );
    const tx = await contract
      .addSibling(
        siblingChain === "ethereum" ? "ethereum-sepolia" : siblingChain,
        CROSSCHAIN_NATIVE_SWAP[siblingChainName]
      )
      .then((tx: any) => tx.wait());

    console.log("Added sibling", tx.transactionHash);
  });
