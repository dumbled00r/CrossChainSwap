import { task } from "hardhat/config";
import { USDC } from "../constants/address";
import { Chain } from "../constants/chains";
import erc20Abi from "../constants/abi/ERC20.json";

task("approve", "Approve USDC given to given `spender`")
  .addPositionalParam("spender")
  .setAction(async (taskArgs, hre) => {
    const { spender } = taskArgs;
    const ethers = hre.ethers;
    const [deployer] = await ethers.getSigners();
    const chainName = hre.network.name as Chain;

    if (chainName !== Chain.AVALANCHE && chainName !== Chain.ETHEREUM) return;

    const tokenAddress = USDC[chainName];

    const contract = new ethers.Contract(tokenAddress, erc20Abi, deployer);
    const allowance = await contract.allowance(deployer.address, spender);
    console.log("Allowance:", allowance.toString());

    const tx = await contract
      .approve(spender, ethers.MaxUint256)
      .then((tx: any) => tx.wait());
    // if (allowance == 0) {
    //   const tx = await contract
    //     .approve(spender, ethers.MaxUint256)
    //     .then((tx: any) => tx.wait());
    //   console.log(`Approved USDC:`, tx.transactionHash);
    // } else {
    //   console.log("Already approved", "USDC");
    //   console.log("Allowance:", allowance.toString());
    // }
  });
