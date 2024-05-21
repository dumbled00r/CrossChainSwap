import { task } from "hardhat/config";
import uniswapRouterAbi from "../constants/abi/UniswapV2Router02.json";
import pangolinRouterAbi from "../constants/abi/PangolinRouter.json";
import { ROUTER, USDC } from "../constants/address";
import { Chain } from "../constants/chains";

task(
  "lp-native",
  "Add an erc20 token - native token pair to given router address"
)
  .addPositionalParam("amountErc20") // full unit amount (specify "10" = 10 * 10^decimals)
  .addPositionalParam("amountNative")
  .setAction(async (taskArgs, hre) => {
    const ethers = hre.ethers;
    const { amountErc20, amountNative } = taskArgs;
    const chainName = hre.network.name as Chain;
    const routerAddress = ROUTER[chainName];
    const [deployer] = await ethers.getSigners();
    if (chainName !== Chain.ETHEREUM && chainName !== Chain.AVALANCHE) return;
    const tokenAddress = USDC[chainName];

    const isPangolin =
      routerAddress.toLowerCase() ===
      "0x2d99abd9008dc933ff5c0cd271b88309593ab921";
    const abi = isPangolin ? pangolinRouterAbi : uniswapRouterAbi;

    const contract = new ethers.Contract(routerAddress, abi, deployer);

    // Approve if needed
    // await hre.run("approve", {
    //   spender: routerAddress,
    // });

    const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 20;
    const amountTokenErc20 = ethers.parseUnits(amountErc20, 6);
    const amountTokenNative = ethers.parseUnits(amountNative, 18);
    const functionName = isPangolin ? "addLiquidityAVAX" : "addLiquidityETH";
    const tx = await contract[functionName](
      tokenAddress,
      amountTokenErc20,
      0,
      0,
      deployer.address,
      deadline,
      { value: amountTokenNative, gasLimit: 300000 }
    );

    console.log("Tx: ", tx.hash);
  });

// avalanche: https://testnet.snowtrace.io/tx/0xdf94748fbba317defd6150be23e18975aa9de2366f8f0c9d6c8d761be1874328
// We can also add Pool using uniswap's instance: https://uniswap.sourcehat.com/#/add/v2/ETH/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
// https://sepolia.etherscan.io/tx/0x661bd3d5001cfe4d8745317dab77802d05c6dfe7821cf70510235fbc144b59c1
