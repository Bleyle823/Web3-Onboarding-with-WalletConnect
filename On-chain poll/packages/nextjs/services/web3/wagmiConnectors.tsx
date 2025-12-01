import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { rainbowkitBurnerWallet } from "burner-connector";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks } = scaffoldConfig;

/**
 * Wallet connectors configuration
 * 
 * This setup uses RainbowKit which is built on top of WalletConnect/Reown.
 * WalletConnect enables connections to 700+ wallets via the WalletConnect Network.
 * 
 * Supported wallets include:
 * - MetaMask (direct connection)
 * - WalletConnect (connects to 700+ wallets via WalletConnect Network)
 * - Coinbase Wallet
 * - Ledger
 * - Rainbow Wallet
 * - Safe Wallet
 * 
 * Learn more: https://docs.reown.com/appkit/overview
 * WalletConnect Docs: https://docs.walletconnect.network/app-sdk/overview
 */
const wallets = [
  metaMaskWallet,
  walletConnectWallet, // Enables 700+ wallets via WalletConnect/Reown Network
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  ...(!targetNetworks.some(network => network.id !== (chains.hardhat as chains.Chain).id) || !onlyLocalBurnerWallet
    ? [rainbowkitBurnerWallet]
    : []),
];

/**
 * wagmi connectors for the wagmi context
 * 
 * Configured with WalletConnect/Reown Project ID for cross-wallet compatibility
 * This enables secure wallet connections across 700+ wallets and 65,000+ apps
 */
export const wagmiConnectors = () => {
  // Only create connectors on client-side to avoid SSR issues
  // TODO: update when https://github.com/rainbow-me/rainbowkit/issues/2476 is resolved
  if (typeof window === "undefined") {
    return [];
  }

  return connectorsForWallets(
    [
      {
        groupName: "Supported Wallets",
        wallets,
      },
    ],
    {
      appName: "On-Chain Poll",
      projectId: scaffoldConfig.walletConnectProjectId, // Default WalletConnect Project ID - ready to use
      // WalletConnect/Reown configuration
      // This enables connections via the decentralized WalletConnect Network
    },
  );
};
