"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import toast from "react-hot-toast";

export const AddQuestion = () => {
  const { address } = useAccount();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reward, setReward] = useState("");

  // Check if user is owner
  const { data: owner } = useScaffoldReadContract({
    contractName: "Trivia",
    functionName: "owner",
  });

  const { writeContractAsync: addQuestion, isPending: isAdding } = useScaffoldWriteContract({
    contractName: "Trivia",
  });

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  const handleAddQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    if (!reward || parseFloat(reward) <= 0) {
      toast.error("Please enter a valid reward amount");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const rewardAmount = parseEther(reward);
      await addQuestion({
        functionName: "addQuestion",
        args: [question.trim(), answer.trim(), rewardAmount],
      });

      toast.success("Question added successfully!");
      setQuestion("");
      setAnswer("");
      setReward("");
    } catch (error: any) {
      console.error("Error adding question:", error);
      if (error?.message?.includes("Only owner")) {
        toast.error("Only the contract owner can add questions");
      } else {
        toast.error(error?.message || "Failed to add question");
      }
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-accent mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">➕ Add New Question (Owner Only)</h2>
        
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Question</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter the trivia question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Answer</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter the correct answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Reward Amount (MRT)</span>
            </label>
            <input
              type="number"
              step="0.000001"
              min="0"
              className="input input-bordered"
              placeholder="e.g., 100"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
          </div>

          <button
            className="btn btn-accent w-full"
            onClick={handleAddQuestion}
            disabled={isAdding || !question.trim() || !answer.trim() || !reward}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding Question...
              </>
            ) : (
              "Add Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

