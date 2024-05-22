"use client";

import Image from "next/image";
import { useState } from "react";

const SwapSector = () => {
  const [senderAsset, setSenderAsset] = useState("AVAX");
  const [recipientAsset, setRecipientAsset] = useState("ETH");

  const assets = [
    { name: "AVAX", image: "/assets/images/AVAX.png" },
    { name: "ETH", image: "/assets/images/ETH.png" },
    // Add more assets as needed
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#CAF4FF]">
      <div className="bg-[#5AB2FF] p-8 rounded-3xl shadow-lg max-w-lg w-full mt-[-150px]">
        <h2 className="text-center text-3xl font-bold text-white mb-8">
          Crosschain Swap ✨
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-white">Source</label>
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
                className="bg-transparent border-none text-white flex-grow outline-none font-bold caret-transparent"
              />
              <button className="bg-[#34D399] text-black px-4 py-2 rounded-lg font-bold">
                MAX
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold text-white">
              Destination
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
                type="text"
                className="bg-transparent text-white flex-grow outline-none font-bold border-5"
                value=""
                readOnly
              />
            </div>
          </div>

          <div className="bg-[#A0DEFF] p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-white font-bold">
              <span>Network Fee:</span>
              <span>0.00012 AVAX</span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>Estimated output:</span>
              <span>0.00012 ETH</span>
            </div>
          </div>

          <button className="w-full bg-[#8B5CF6] text-white py-3 rounded-lg mt-4 font-bold text-lg">
            SWAP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapSector;