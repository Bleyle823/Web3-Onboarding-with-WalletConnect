"use client";

import type { NextPage } from "next";
import { TriviaGame } from "~~/components/TriviaGame";
import { AddQuestion } from "~~/components/AddQuestion";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="w-full max-w-6xl mx-auto px-4">
          <AddQuestion />
          <TriviaGame />
        </div>
      </div>
    </>
  );
};

export default Home;
