import { Chain } from "./chains";

export const GATEWAY = {
  [Chain.ETHEREUM]: "0xe432150cce91c13a887f7D836923d5597adD8E31",
  [Chain.AVALANCHE]: "0xC249632c2D40b9001FE907806902f63038B737Ab",
};

export const GAS_RECEIVER = {
  [Chain.ETHEREUM]: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  [Chain.AVALANCHE]: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
};

export const ROUTER = {
  [Chain.AVALANCHE]: "0x2D99ABD9008Dc933ff5c0CD271B88309593aB921",
  [Chain.ETHEREUM]: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
};

export const WRAPPED_NATIVE_ASSET = {
  [Chain.ETHEREUM]: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9",
  [Chain.AVALANCHE]: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
};
export const USDC = {
  [Chain.AVALANCHE]: "0x5425890298aed601595a70ab815c96711a31bc65",
  [Chain.ETHEREUM]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
};

export const CROSSCHAIN_NATIVE_SWAP = {
  [Chain.AVALANCHE]: "0xe59d41ebE7B0A5A684B1d6183E4c79163588Af02", // need to add siblings to each other
  [Chain.ETHEREUM]: "0x97EC4e4bEb78b15a170660056Ef9D3d1998f0476",
};

export const MESSAGE_TRANSMITTER = {
  [Chain.AVALANCHE]: "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79",
  [Chain.ETHEREUM]: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
};

export const TOKEN_MESSENGER = {
  [Chain.AVALANCHE]: "0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0",
  [Chain.ETHEREUM]: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
};

export const DOMAIN = {
  [Chain.ETHEREUM]: 0,
  [Chain.AVALANCHE]: 1,
};
