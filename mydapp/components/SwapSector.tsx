"use client";

import { ROUTER } from "@/constants/addresses";
import { Chain, ChainIdToName, ChainToId } from "@/constants/chains";
import { estimateFee } from "@/utils/estimateFee";
import { estimateSwapOutputAmount } from "@/utils/estimateOutput";
import { ethers } from "ethers";
import Image from "next/image";
import { useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";

const SwapSector = () => {
  const [senderAsset, setSenderAsset] = useState("AVAX");
  const [recipientAsset, setRecipientAsset] = useState("ETH");
  const [amount, setAmount] = useState("");

  /* To do: Set fees/ Estimated output/ swap */
  const [fee, setFee] = useState("0");
  const [output, setOutput] = useState("0");

  const account = useAccount();
  const chainId = useChainId();
  const { data, isError, isLoading } = useBalance({
    address: account.address,
    chainId: chainId,
  });

  const handleInputChange = async (e: any) => {
    const newValue = e.target.value;
    setAmount(newValue);
    if (Number(newValue) > 0) {
      const fee = await estimateFee(
        ChainIdToName[chainId],
        ChainIdToName[chainId] === Chain.AVALANCHE
          ? Chain.ETHEREUM
          : Chain.AVALANCHE
      );
      setFee(fee);

      let _newValue = ethers.parseEther(newValue);
      console.log(_newValue);
      console.log(
        `Router: ${ROUTER[ChainIdToName[chainId]]}`,
        `ChainId: ${chainId}`,
        `Amount: ${_newValue.toString()}`,
        `NativeToErc20: true`
      );
      const output1 = await estimateSwapOutputAmount({
        routerAddress: ROUTER[ChainIdToName[chainId]],
        chainId: chainId,
        amount: _newValue.toString(),
        nativeToErc20: true,
      });

      _newValue = output1 || _newValue;

      // if (BigInt(_newValue) < BigInt(0)) {
      //   console.log("Amount too low");
      // }

      let destOutput = await estimateSwapOutputAmount({
        routerAddress:
          ROUTER[
            ChainIdToName[chainId] === Chain.AVALANCHE
              ? Chain.ETHEREUM
              : Chain.AVALANCHE
          ],
        chainId:
          ChainToId[
            ChainIdToName[chainId] === Chain.AVALANCHE
              ? Chain.ETHEREUM
              : Chain.AVALANCHE
          ],
        amount: _newValue.toString(),
        nativeToErc20: false,
      });
      setOutput(ethers.formatEther(destOutput).toString());
    } else {
      setFee("0");
      setOutput("0");
    }
  };

  const handleSwap = async (e: any) => {
    console.log(`Swapping ${amount} ${senderAsset} to ${recipientAsset}`);
  };

  const assets = [
    { name: "AVAX", image: "/assets/images/AVAX.png" },
    { name: "ETH", image: "/assets/images/ETH.png" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#CAF4FF]">
      <div className="bg-[#5AB2FF] p-8 rounded-3xl shadow-lg max-w-lg w-full mt-[-150px]">
        <h2 className="text-center text-3xl font-bold text-white mb-8">
          Crosschain Swap ✨
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-white">
              Source:
              {" " + ChainIdToName[chainId].toUpperCase()}
            </label>
            <div className="flex items-center mt-2 space-x-4 bg-[#A0DEFF] p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <select
                  value={senderAsset}
                  onChange={(e) => setSenderAsset(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none"
                >
                  {assets.map((asset) => (
                    <option
                      key={asset.name}
                      value={asset.name}
                      className="bg-[#1F2937] text-white"
                    >
                      {asset.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={
                    assets.find((asset) => asset.name === senderAsset)?.image ||
                    ""
                  }
                  alt={senderAsset}
                  width={30}
                  height={30}
                />
              </div>
              <input
                dir="RTL"
                type="text"
                value={amount}
                id="amountSwap"
                onChange={async (e) => {
                  await handleInputChange(e);
                }}
                className="bg-transparent border-none text-white flex-grow outline-none font-bold caret-transparent"
              />
              <button
                className="bg-[#34D399] text-black px-4 py-2 rounded-lg font-bold"
                onClick={async (e) => {
                  const newValue = data?.formatted.slice(0, 10) || "";
                  setAmount(newValue);
                  // Simulate an input change event
                  await handleInputChange({ target: { value: newValue } });
                }}
              >
                MAX
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold text-white">
              Destination:{" "}
              {ChainIdToName[chainId] === Chain.AVALANCHE
                ? Chain.ETHEREUM.toUpperCase()
                : Chain.AVALANCHE.toUpperCase()}
            </label>
            <div className="flex items-center mt-2 space-x-4 bg-[#A0DEFF] p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <select
                  value={recipientAsset}
                  onChange={(e) => setRecipientAsset(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none"
                >
                  {assets.map((asset) => (
                    <option
                      key={asset.name}
                      value={asset.name}
                      className="bg-[#1F2937] text-white"
                    >
                      {asset.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={
                    assets.find((asset) => asset.name === recipientAsset)
                      ?.image || ""
                  }
                  alt={recipientAsset}
                  width={30}
                  height={30}
                />
              </div>
              <input
                dir="RTL"
                type="text"
                className="bg-transparent border-none text-white flex-grow outline-none font-bold caret-transparent"
                value={`${output.substring(0, 10)}`}
                readOnly
              />
            </div>
          </div>

          <div className="bg-[#A0DEFF] p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-white font-bold">
              <span>Network Fee:</span>
              <span>
                {fee} {data?.symbol}
              </span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>Estimated output:</span>
              <span>
                {output} {data?.symbol === "AVAX" ? "ETH" : "AVAX"}
              </span>
            </div>
          </div>
          {account.isConnected ? (
            <button
              className="w-full bg-[#8B5CF6] text-white py-3 rounded-lg mt-4 font-bold text-lg"
              onClick={async (e) => {
                await handleSwap(e);
              }}
            >
              SWAP
            </button>
          ) : (
            <button className="w-full bg-[#391983] text-white py-3 rounded-lg mt-4 font-bold text-lg">
              PLEASE CONNECT WALLET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapSector;
