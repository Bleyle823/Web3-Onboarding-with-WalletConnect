"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "@scaffold-ui/components";
import toast from "react-hot-toast";
import { QuestionCard } from "./QuestionCard";

export const TriviaGame = () => {
  const { address } = useAccount();

  // Read question count
  const { data: questionCount, refetch: refetchCount } = useScaffoldReadContract({
    contractName: "Trivia",
    functionName: "getQuestionCount",
  });

  // Read token balance
  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "MockERC20",
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const questionCountNum = questionCount ? Number(questionCount) : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="w-full mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">🎯 Trivia Game</h1>
        <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
          {address && (
            <div className="badge badge-primary badge-lg">
              <Address address={address} />
            </div>
          )}
          {tokenBalance !== undefined && (
            <div className="badge badge-secondary badge-lg">
              Balance: {formatEther(tokenBalance)} MRT
            </div>
          )}
        </div>
        <p className="text-center text-lg opacity-70">
          Answer questions correctly to earn reward tokens!
        </p>
      </div>

      {/* Questions List */}
      <div className="w-full space-y-4">
        {questionCountNum === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl opacity-70">No questions available yet.</p>
            <p className="text-sm opacity-50 mt-2">Check back later or add questions if you're the owner.</p>
          </div>
        ) : (
          Array.from({ length: questionCountNum }).map((_, index) => (
            <QuestionCard
              key={index}
              questionId={index}
              address={address}
              onAnswerSuccess={() => {
                refetchCount();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
