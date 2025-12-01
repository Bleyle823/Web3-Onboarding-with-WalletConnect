"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import toast from "react-hot-toast";

type QuestionCardProps = {
  questionId: number;
  address: string | undefined;
  onAnswerSuccess: () => void;
};

export const QuestionCard = ({ questionId, address, onAnswerSuccess }: QuestionCardProps) => {
  const [selected, setSelected] = useState(false);
  const [answer, setAnswer] = useState("");

  // Read question details
  const { data: questionData } = useScaffoldReadContract({
    contractName: "Trivia",
    functionName: "questions",
    args: [BigInt(questionId)],
  });

  // Check if user has answered
  const { data: hasAnswered } = useScaffoldReadContract({
    contractName: "Trivia",
    functionName: "hasAnswered",
    args: address ? [BigInt(questionId), address as `0x${string}`] : undefined,
  });

  // Write contract for answering
  const { writeContractAsync: answerQuestion, isPending: isAnswering } = useScaffoldWriteContract({
    contractName: "Trivia",
  });

  const question = questionData?.[0] || "";
  const reward = questionData?.[2] || 0n;
  const active = questionData?.[3] ?? false;
  const answered = hasAnswered ?? false;

  const handleAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      await answerQuestion({
        functionName: "answerQuestion",
        args: [BigInt(questionId), answer.trim()],
      });

      toast.success("Answer submitted! Checking...");
      setAnswer("");
      setSelected(false);
      
      // Wait a bit then refetch
      setTimeout(() => {
        onAnswerSuccess();
      }, 2000);
    } catch (error: any) {
      console.error("Error answering question:", error);
      if (error?.message?.includes("Wrong answer") || error?.shortMessage?.includes("Wrong answer")) {
        toast.error("Wrong answer! Try again.");
      } else if (error?.message?.includes("Already answered") || error?.shortMessage?.includes("Already answered")) {
        toast.error("You've already answered this question!");
        onAnswerSuccess();
      } else {
        toast.error(error?.message || error?.shortMessage || "Failed to submit answer");
      }
    }
  };

  if (!question) {
    return (
      <div className="card bg-base-100 shadow-xl border-2 border-base-300">
        <div className="card-body">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card bg-base-100 shadow-xl border-2 ${
        selected ? "border-primary" : "border-base-300"
      }`}
    >
      <div className="card-body">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          <h2 className="card-title text-xl">Question #{questionId + 1}</h2>
          <div className="flex gap-2 flex-wrap">
            {answered && (
              <div className="badge badge-success">Answered ✓</div>
            )}
            {active ? (
              <div className="badge badge-primary">Active</div>
            ) : (
              <div className="badge badge-ghost">Inactive</div>
            )}
            <div className="badge badge-secondary">
              Reward: {formatEther(reward)} MRT
            </div>
          </div>
        </div>

        <p className="text-lg mb-4">{question}</p>

        {!answered && active && (
          <div className="mt-4">
            {!selected ? (
              <button
                className="btn btn-primary"
                onClick={() => setSelected(true)}
              >
                Answer This Question
              </button>
            ) : (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Answer</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    className="input input-bordered w-full"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAnswer();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary flex-1"
                    onClick={handleAnswer}
                    disabled={isAnswering || !answer.trim()}
                  >
                    {isAnswering ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setSelected(false);
                      setAnswer("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {answered && (
          <div className="alert alert-success mt-4">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You've already answered this question and received your reward!</span>
          </div>
        )}
      </div>
    </div>
  );
};

