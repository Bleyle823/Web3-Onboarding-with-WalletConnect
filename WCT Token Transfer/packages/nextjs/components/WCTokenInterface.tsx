"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "@scaffold-ui/components";
import { hardhat } from "viem/chains";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const WCTokenInterface = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");

  // Read contract data
  const { data: tokenName } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "name",
  });

  const { data: tokenSymbol } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "symbol",
  });

  const { data: tokenDecimals } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "decimals",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "totalSupply",
  });

  const { data: initialSupply } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "INITIAL_SUPPLY",
  });

  const { data: userBalance } = useScaffoldReadContract({
    contractName: "WCToken",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Write contract functions
  const { writeContractAsync: claimTokens, isPending: isClaiming } = useScaffoldWriteContract("WCToken");
  const { writeContractAsync: burnTokens, isPending: isBurning } = useScaffoldWriteContract("WCToken");
  const { writeContractAsync: transferTokens, isPending: isTransferring } = useScaffoldWriteContract("WCToken");
  const { writeContractAsync: approveTokens, isPending: isApproving } = useScaffoldWriteContract("WCToken");

  const handleClaim = async () => {
    try {
      await claimTokens({
        functionName: "claim",
      });
      setTransferAmount("");
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  const handleBurn = async () => {
    if (!burnAmount) return;
    try {
      const amount = parseEther(burnAmount);
      await burnTokens({
        functionName: "burn",
        args: [amount],
      });
      setBurnAmount("");
    } catch (error) {
      console.error("Error burning tokens:", error);
    }
  };

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) return;
    try {
      const amount = parseEther(transferAmount);
      await transferTokens({
        functionName: "transfer",
        args: [transferTo as `0x${string}`, amount],
      });
      setTransferTo("");
      setTransferAmount("");
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const handleApprove = async () => {
    if (!approveSpender || !approveAmount) return;
    try {
      const amount = parseEther(approveAmount);
      await approveTokens({
        functionName: "approve",
        args: [approveSpender as `0x${string}`, amount],
      });
      setApproveSpender("");
      setApproveAmount("");
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  };

  const formatTokenAmount = (amount: bigint | undefined) => {
    if (!amount) return "0";
    return formatEther(amount);
  };

  const canClaim = userBalance === 0n || userBalance === undefined;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">💰 WalletConnect Token (WCT)</h1>
        <p className="text-lg text-base-content/70">Interact with your WCT tokens</p>
      </div>

      {/* Token Information Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Token Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/70">Token Name</p>
              <p className="text-lg font-semibold">{tokenName || "Loading..."}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Token Symbol</p>
              <p className="text-lg font-semibold">{tokenSymbol || "Loading..."}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Your Balance</p>
              <p className="text-lg font-semibold">
                {formatTokenAmount(userBalance)} {tokenSymbol || "WCT"}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Total Supply</p>
              <p className="text-lg font-semibold">
                {formatTokenAmount(totalSupply)} {tokenSymbol || "WCT"}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Initial Supply</p>
              <p className="text-lg font-semibold">
                {formatTokenAmount(initialSupply)} {tokenSymbol || "WCT"}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Decimals</p>
              <p className="text-lg font-semibold">{tokenDecimals?.toString() || "18"}</p>
            </div>
          </div>
          {connectedAddress && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <p className="text-sm text-base-content/70 mb-2">Your Address</p>
              <Address
                address={connectedAddress}
                chain={targetNetwork}
                blockExplorerAddressLink={
                  targetNetwork.id === hardhat.id ? `/blockexplorer/address/${connectedAddress}` : undefined
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Claim Tokens Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">🎁 Claim Tokens</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Claim 100 WCT tokens (one-time only). You can only claim if your balance is 0.
          </p>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-2">You will receive: 100 WCT</p>
              {!canClaim && (
                <p className="text-sm text-warning">⚠️ You already have tokens. Claim is only available for new users.</p>
              )}
            </div>
            <button
              className="btn btn-primary"
              onClick={handleClaim}
              disabled={!canClaim || isClaiming || !connectedAddress}
            >
              {isClaiming ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Claiming...
                </>
              ) : (
                "Claim 100 WCT"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Tokens Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📤 Transfer Tokens</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">
                <span className="label-text">Recipient Address</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full"
                value={transferTo}
                onChange={e => setTransferTo(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Amount (WCT)</span>
              </label>
              <input
                type="text"
                placeholder="0.0"
                className="input input-bordered w-full"
                value={transferAmount}
                onChange={e => setTransferAmount(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleTransfer}
              disabled={!transferTo || !transferAmount || isTransferring || !connectedAddress}
            >
              {isTransferring ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Transferring...
                </>
              ) : (
                "Transfer"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Burn Tokens Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">🔥 Burn Tokens</h2>
          <p className="text-sm text-base-content/70 mb-4">Permanently burn your WCT tokens.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">
                <span className="label-text">Amount to Burn (WCT)</span>
              </label>
              <input
                type="text"
                placeholder="0.0"
                className="input input-bordered w-full"
                value={burnAmount}
                onChange={e => setBurnAmount(e.target.value)}
              />
            </div>
            <button
              className="btn btn-error"
              onClick={handleBurn}
              disabled={!burnAmount || isBurning || !connectedAddress}
            >
              {isBurning ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Burning...
                </>
              ) : (
                "Burn Tokens"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Approve Tokens Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">✅ Approve Tokens</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Approve a spender to transfer tokens on your behalf (e.g., for DEX swaps).
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">
                <span className="label-text">Spender Address</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full"
                value={approveSpender}
                onChange={e => setApproveSpender(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Amount to Approve (WCT)</span>
              </label>
              <input
                type="text"
                placeholder="0.0"
                className="input input-bordered w-full"
                value={approveAmount}
                onChange={e => setApproveAmount(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleApprove}
              disabled={!approveSpender || !approveAmount || isApproving || !connectedAddress}
            >
              {isApproving ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </button>
          </div>
        </div>
      </div>

      {!connectedAddress && (
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Please connect your wallet to interact with the contract.</span>
        </div>
      )}
    </div>
  );
};

