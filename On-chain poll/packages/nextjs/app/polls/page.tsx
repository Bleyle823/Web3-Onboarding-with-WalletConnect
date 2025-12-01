"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { Address } from "@scaffold-ui/components";

const Polls: NextPage = () => {
  const { address } = useAccount();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState("7"); // days
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);

  // Read poll count
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "Poll",
    functionName: "pollCount",
  });

  // Write contract for creating poll
  const { writeContractAsync: createPoll } = useScaffoldWriteContract("Poll");

  // Write contract for voting
  const { writeContractAsync: vote } = useScaffoldWriteContract("Poll");

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      notification.error("Please enter a question");
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      notification.error("Please provide at least 2 options");
      return;
    }

    if (validOptions.length > 10) {
      notification.error("Maximum 10 options allowed");
      return;
    }

    try {
      const durationInSeconds = parseInt(duration) * 24 * 60 * 60;
      await createPoll({
        functionName: "createPoll",
        args: [question, validOptions, BigInt(durationInSeconds)],
      });
      notification.success("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      setDuration("7");
    } catch (error: any) {
      notification.error(error.message || "Failed to create poll");
    }
  };

  const handleVote = async (pollId: number, optionIndex: number) => {
    try {
      await vote({
        functionName: "vote",
        args: [BigInt(pollId), BigInt(optionIndex)],
      });
      notification.success("Vote cast successfully!");
    } catch (error: any) {
      notification.error(error.message || "Failed to vote");
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center text-4xl font-bold mb-8">On-Chain Polls</h1>

        {/* Create Poll Section */}
        <div className="bg-base-100 rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Poll</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Question</span>
              </label>
              <input
                type="text"
                placeholder="Enter your poll question"
                className="input input-bordered w-full"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Options (2-10)</span>
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="input input-bordered flex-1"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {options.length < 10 && (
                <button className="btn btn-sm btn-secondary mt-2" onClick={handleAddOption}>
                  Add Option
                </button>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Duration (days)</span>
              </label>
              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={handleCreatePoll}
              disabled={!address}
            >
              {address ? "Create Poll" : "Connect Wallet to Create Poll"}
            </button>
          </div>
        </div>

        {/* Polls List */}
        <div className="bg-base-100 rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Active Polls</h2>
          <PollList
            pollCount={pollCount ? Number(pollCount) : 0}
            selectedPollId={selectedPollId}
            setSelectedPollId={setSelectedPollId}
            onVote={handleVote}
            address={address}
          />
        </div>
      </div>
    </div>
  );
};

interface PollListProps {
  pollCount: number;
  selectedPollId: number | null;
  setSelectedPollId: (id: number | null) => void;
  onVote: (pollId: number, optionIndex: number) => void;
  address: string | undefined;
}

const PollList = ({ pollCount, selectedPollId, setSelectedPollId, onVote, address }: PollListProps) => {
  if (pollCount === 0) {
    return <p className="text-center text-lg">No polls created yet. Create the first poll above!</p>;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: pollCount }, (_, i) => (
        <PollCard
          key={i}
          pollId={i}
          selectedPollId={selectedPollId}
          setSelectedPollId={setSelectedPollId}
          onVote={onVote}
          address={address}
        />
      ))}
    </div>
  );
};

interface PollCardProps {
  pollId: number;
  selectedPollId: number | null;
  setSelectedPollId: (id: number | null) => void;
  onVote: (pollId: number, optionIndex: number) => void;
  address: string | undefined;
}

const PollCard = ({ pollId, selectedPollId, setSelectedPollId, onVote, address }: PollCardProps) => {
  const { data: pollResults } = useScaffoldReadContract({
    contractName: "Poll",
    functionName: "getPollResults",
    args: [BigInt(pollId)],
  });

  const { data: pollData } = useScaffoldReadContract({
    contractName: "Poll",
    functionName: "polls",
    args: [BigInt(pollId)],
  });

  const { data: userHasVoted } = useScaffoldReadContract({
    contractName: "Poll",
    functionName: "hasVoted",
    args: address ? [BigInt(pollId), address as `0x${string}`] : undefined,
  });

  const isExpanded = selectedPollId === pollId;
  const hasVoted = userHasVoted === true;

  if (!pollResults || !pollData) {
    return (
      <div className="border border-base-300 rounded-lg p-4">
        <p>Loading poll {pollId}...</p>
      </div>
    );
  }

  const [question, optionNames, voteCounts, totalVotes, active] = pollResults;
  const endTime = pollData ? Number(pollData[1]) : 0; // endTime is the second element in polls mapping
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = !active || (endTime > 0 && currentTime >= endTime);

  return (
    <div className="border border-base-300 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{question || `Poll #${pollId}`}</h3>
          <div className="flex gap-4 text-sm text-base-content/70">
            <span>Poll ID: {pollId}</span>
            <span>Total Votes: {totalVotes?.toString() || "0"}</span>
            <span className={isExpired ? "text-error" : "text-success"}>
              {isExpired ? "Ended" : "Active"}
            </span>
            {endTime > 0 && !isExpired && (
              <span>
                Ends: {new Date(endTime * 1000).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setSelectedPollId(isExpanded ? null : pollId)}
        >
          {isExpanded ? "Collapse" : "View Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {optionNames && optionNames.length > 0 ? (
            optionNames.map((optionName, index) => {
              const votes = voteCounts?.[index] ? Number(voteCounts[index]) : 0;
              const percentage = totalVotes && Number(totalVotes) > 0 
                ? ((votes / Number(totalVotes)) * 100).toFixed(1) 
                : "0";

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{optionName}</span>
                    <span className="text-sm text-base-content/70">
                      {votes} votes ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-4">
                    <div
                      className="bg-primary h-4 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {!hasVoted && !isExpired && address && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onVote(pollId, index)}
                    >
                      Vote
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No options available</p>
          )}

          {!address && (
            <p className="text-warning text-sm">Connect your wallet to vote</p>
          )}
          {hasVoted && (
            <p className="text-success text-sm">✓ You have already voted on this poll</p>
          )}
          {isExpired && (
            <p className="text-error text-sm">This poll has ended</p>
          )}
          {endTime > 0 && !isExpired && (
            <p className="text-info text-sm">
              Poll ends: {new Date(endTime * 1000).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Polls;

