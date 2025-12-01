"use client";

import { useState } from "react";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useBalance } from "wagmi";
import toast from "react-hot-toast";
import {
  SparklesIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [mintTokenURI, setMintTokenURI] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  // Read collection stats
  const { data: collectionStats, refetch: refetchStats } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "getCollectionStats",
  });

  // Read contract info
  const { data: name } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "name",
  });

  const { data: symbol } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "symbol",
  });

  // Get contract address
  const { data: deployedContract } = useDeployedContractInfo({
    contractName: "WalletConnectNFT",
  });

  // Read user's balance
  const { data: userBalance, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Read user's mint stats
  const { data: mintStats, refetch: refetchMintStats } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "getMintStats",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Read user's owned tokens
  const { data: ownedTokens, refetch: refetchOwnedTokens } = useScaffoldReadContract({
    contractName: "WalletConnectNFT",
    functionName: "tokensOfOwner",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Get user's ETH balance
  const { data: ethBalance } = useBalance({
    address: connectedAddress,
  });

  // Write contract hooks
  const { writeContractAsync: mintNFT } = useScaffoldWriteContract("WalletConnectNFT");
  const { writeContractAsync: freeMintNFT } = useScaffoldWriteContract("WalletConnectNFT");

  const handleMint = async () => {
    if (!connectedAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!mintTokenURI.trim()) {
      toast.error("Please enter a token URI");
      return;
    }

    if (!collectionStats) {
      toast.error("Loading collection data...");
      return;
    }

    const [currentSupply, maxSupply, mintPrice, mintingEnabled, publicMintEnabled] = collectionStats;

    if (!mintingEnabled) {
      toast.error("Minting is currently disabled");
      return;
    }

    if (currentSupply >= maxSupply) {
      toast.error("Maximum supply reached");
      return;
    }

    try {
      setIsMinting(true);

      // Check if user is whitelisted and can free mint
      if (mintStats && mintStats[2]) {
        // User is whitelisted
        if (mintStats[1] > 0n) {
          // Has remaining free mints
          await freeMintNFT({
            functionName: "freeMint",
            args: [mintTokenURI],
            onSuccess: () => {
              toast.success("NFT minted successfully!");
              setMintTokenURI("");
              refetchStats();
              refetchBalance();
              refetchMintStats();
              refetchOwnedTokens();
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to mint NFT");
            },
          });
        } else {
          // No free mints left, use paid mint
          if (!publicMintEnabled && !mintStats[2]) {
            toast.error("Public minting is disabled and you're not whitelisted");
            setIsMinting(false);
            return;
          }

          if (ethBalance && ethBalance.value < mintPrice) {
            toast.error("Insufficient ETH balance");
            setIsMinting(false);
            return;
          }

          await mintNFT({
            functionName: "mint",
            args: [mintTokenURI],
            value: mintPrice,
            onSuccess: () => {
              toast.success("NFT minted successfully!");
              setMintTokenURI("");
              refetchStats();
              refetchBalance();
              refetchMintStats();
              refetchOwnedTokens();
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to mint NFT");
            },
          });
        }
      } else {
        // User is not whitelisted, use paid mint
        if (!publicMintEnabled) {
          toast.error("Public minting is currently disabled");
          setIsMinting(false);
          return;
        }

        if (ethBalance && ethBalance.value < mintPrice) {
          toast.error("Insufficient ETH balance");
          setIsMinting(false);
          return;
        }

        await mintNFT({
          functionName: "mint",
          args: [mintTokenURI],
          value: mintPrice,
          onSuccess: () => {
            toast.success("NFT minted successfully!");
            setMintTokenURI("");
            refetchStats();
            refetchBalance();
            refetchMintStats();
            refetchOwnedTokens();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to mint NFT");
          },
        });
      }
    } catch (error: any) {
      toast.error(error?.message || "Transaction failed");
    } finally {
      setIsMinting(false);
    }
  };

  // Format collection stats
  const currentSupply = collectionStats ? Number(collectionStats[0]) : 0;
  const maxSupply = collectionStats ? Number(collectionStats[1]) : 0;
  const mintPrice = collectionStats ? collectionStats[2] : 0n;
  const mintingEnabled = collectionStats ? collectionStats[3] : false;
  const publicMintEnabled = collectionStats ? collectionStats[4] : false;

  // Format mint stats
  const mintedCount = mintStats ? Number(mintStats[0]) : 0;
  const remainingMints = mintStats ? Number(mintStats[1]) : 0;
  const isWhitelisted = mintStats ? mintStats[2] : false;
  const userMintPrice = mintStats ? mintStats[3] : 0n;

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 pb-10">
        <div className="px-5 w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {name || "WalletConnect NFT"}
            </h1>
            <p className="text-xl text-base-content/70 mb-4">
              {symbol || "WCNFT"} Collection on Base
            </p>
            {deployedContract && (
              <div className="flex justify-center items-center space-x-2 mb-2">
                <p className="text-sm font-medium">Contract:</p>
                <Address
                  address={deployedContract.address}
                  chain={targetNetwork}
                  blockExplorerAddressLink={
                    targetNetwork.id === hardhat.id
                      ? `/blockexplorer/address/${deployedContract.address}`
                      : undefined
                  }
                />
              </div>
            )}
            {connectedAddress && (
              <div className="flex justify-center items-center space-x-2">
                <p className="text-sm font-medium">Your Address:</p>
                <Address
                  address={connectedAddress}
                  chain={targetNetwork}
                  blockExplorerAddressLink={
                    targetNetwork.id === hardhat.id
                      ? `/blockexplorer/address/${connectedAddress}`
                      : undefined
                  }
                />
              </div>
            )}
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CubeIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">{currentSupply}</span>
              </div>
              <p className="text-sm text-base-content/70">Current Supply</p>
              <p className="text-xs text-base-content/50 mt-1">Max: {maxSupply.toLocaleString()}</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="h-8 w-8 text-secondary" />
                <span className="text-2xl font-bold">
                  {mintPrice ? formatEther(mintPrice) : "0"} ETH
                </span>
              </div>
              <p className="text-sm text-base-content/70">Mint Price</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                {mintingEnabled ? (
                  <CheckCircleIcon className="h-8 w-8 text-success" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-error" />
                )}
                <span className="text-sm font-semibold">
                  {mintingEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-sm text-base-content/70">Minting Status</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                {publicMintEnabled ? (
                  <UserGroupIcon className="h-8 w-8 text-info" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-error" />
                )}
                <span className="text-sm font-semibold">
                  {publicMintEnabled ? "Public" : "Whitelist Only"}
                </span>
              </div>
              <p className="text-sm text-base-content/70">Mint Type</p>
            </div>
          </div>

          {/* User Stats */}
          {connectedAddress && (
            <div className="bg-base-100 rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-base-content/70 mb-1">Your Balance</p>
                  <p className="text-xl font-bold">{userBalance ? Number(userBalance) : 0} NFTs</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70 mb-1">Minted</p>
                  <p className="text-xl font-bold">{mintedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70 mb-1">Remaining Mints</p>
                  <p className="text-xl font-bold">{remainingMints}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70 mb-1">Whitelist Status</p>
                  <p className="text-xl font-bold">
                    {isWhitelisted ? (
                      <span className="text-success">Whitelisted</span>
                    ) : (
                      <span className="text-base-content/50">Not Whitelisted</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mint Section */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6" />
              Mint NFT
            </h2>

            {!connectedAddress ? (
              <div className="text-center py-8">
                <p className="text-lg text-base-content/70 mb-4">
                  Connect your wallet to mint NFTs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Token URI</label>
                  <input
                    type="text"
                    value={mintTokenURI}
                    onChange={(e) => setMintTokenURI(e.target.value)}
                    placeholder="ipfs://Qm..."
                    className="input input-bordered w-full"
                  />
                  <p className="text-xs text-base-content/50 mt-1">
                    Enter the IPFS hash or URL for your NFT metadata
                  </p>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Mint Information:</p>
                  <ul className="text-xs text-base-content/70 space-y-1">
                    <li>
                      • Price:{" "}
                      {isWhitelisted && remainingMints > 0
                        ? "FREE (Whitelisted)"
                        : `${formatEther(mintPrice)} ETH`}
                    </li>
                    <li>• Your ETH Balance: {ethBalance ? formatEther(ethBalance.value) : "0"} ETH</li>
                    <li>• Remaining Supply: {(maxSupply - currentSupply).toLocaleString()}</li>
                    {isWhitelisted && remainingMints > 0 && (
                      <li className="text-success">• You have {remainingMints} free mint(s) available!</li>
                    )}
                  </ul>
                </div>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleMint}
                  disabled={
                    isMinting ||
                    !mintingEnabled ||
                    currentSupply >= maxSupply ||
                    (!publicMintEnabled && !isWhitelisted) ||
                    (isWhitelisted && remainingMints === 0 && (!ethBalance || ethBalance.value < mintPrice))
                  }
                >
                  {isMinting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      {isWhitelisted && remainingMints > 0
                        ? "Free Mint NFT"
                        : `Mint NFT (${formatEther(mintPrice)} ETH)`}
                    </>
                  )}
                </button>

                {currentSupply >= maxSupply && (
                  <p className="text-error text-center">Maximum supply reached!</p>
                )}
                {!mintingEnabled && (
                  <p className="text-error text-center">Minting is currently disabled</p>
                )}
              </div>
            )}
          </div>

          {/* Owned NFTs */}
          {connectedAddress && userBalance && Number(userBalance) > 0 && (
            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
              {ownedTokens && ownedTokens.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {ownedTokens.map((tokenId: bigint) => (
                    <div
                      key={tokenId.toString()}
                      className="bg-base-200 rounded-lg p-4 text-center hover:bg-base-300 transition-colors"
                    >
                      <p className="text-xs text-base-content/50 mb-1">Token ID</p>
                      <p className="text-lg font-bold">#{tokenId.toString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70">Loading your NFTs...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
