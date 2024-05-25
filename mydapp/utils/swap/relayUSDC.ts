import { ethers } from "ethers";
import { MESSAGE_TRANSMITTER } from "../../constants/addresses";
import { Chain } from "../../constants/chains";
import fetch from "cross-fetch";
import dotenv from "dotenv";
dotenv.config();

export const RPC = {
  [Chain.AVALANCHE]: "https://api.avax-test.network/ext/bc/C/rpc",
  [Chain.ETHEREUM]: "https://rpc-sepolia.rockx.com",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getMessageSentEvent = (
  contract: ethers.Contract,
  txReceipt: ethers.TransactionReceipt
) => {
  const eventLogs = txReceipt.logs;
  const messageSentEventId = ethers.id("MessageSent(bytes)");
  for (const log of eventLogs) {
    if (log.topics[0] === messageSentEventId) {
      return contract.interface.parseLog(log);
    }
  }
  return null;
};

async function fetchAttestation(messageHash: string, maxAttempt = 1000) {
  let attempt = 0;
  while (attempt < maxAttempt) {
    const _response = await fetch(
      `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
    ).then((resp) => resp.json());

    if (_response?.status === "complete") {
      return _response?.attestation;
    }

    await sleep(5000);
    attempt++;
  }
}

export const relayUSDC = async (
  txhash: string,
  chain: Chain,
  signer: ethers.JsonRpcSigner,
  signer2: ethers.JsonRpcSigner
) => {
  // Step 1: Observe for the MessageSent event
  const srcContract = new ethers.Contract(
    MESSAGE_TRANSMITTER[chain],
    ["event MessageSent(bytes message)"],
    signer
  );

  const messageSentReceipt = await signer?.provider?.getTransactionReceipt(
    txhash
  );
  if (!messageSentReceipt) return;

  const log = getMessageSentEvent(srcContract, messageSentReceipt);

  if (log) {
    const message = log.args.message;
    // Step 2: Call the Attestation API to get the signature
    console.log("Receive MessageSent event: ", message);
    const messageHash = ethers.solidityPackedKeccak256(["bytes"], [message]);

    console.log("Getting signature from attestation API...");
    let signature = await fetchAttestation(messageHash);

    if (signature) {
      console.log("Received signature:", signature);
      const destChain =
        chain === Chain.AVALANCHE ? Chain.ETHEREUM : Chain.AVALANCHE;

      const destContract = new ethers.Contract(MESSAGE_TRANSMITTER[destChain], [
        "function receiveMessage(bytes memory _message, bytes calldata _attestation)",
      ]);
      // Step 3: Send a mint transaction
      try {
        console.log("Sending tx to mint USDC on", destChain, "...");
        const receipt = await signer2
          .sendTransaction({
            to: MESSAGE_TRANSMITTER[destChain],
            data: destContract.interface.encodeFunctionData("receiveMessage", [
              message,
              signature,
            ]),
          })
          .then((tx) => tx.wait());
        console.log("Minted USDC", receipt?.hash);
      } catch (e) {
        console.error("Failed to mint USDC", e);
      }
    }
  }
};
