"use client";

import {
  RainbowKitProvider,
  getDefaultConfig,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dotenv from "dotenv";
import * as React from "react";
import { WagmiProvider } from "wagmi";
import { avalancheFuji, sepolia } from "wagmi/chains";

const { wallets } = getDefaultWallets();
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || "";
const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: projectId,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [avalancheFuji, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
