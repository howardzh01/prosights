import React from "react";

const APILimitReached = () => {
  return (
    <div
      className="flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/backgroundPatternLight.svg')",
      }}
    >
      <div className="relative flex flex-col items-center justify-center h-2/3">
        <div className="">
          <p className="text-lg text-gray-800 text-center leading-relaxed">
            You've reached the query limit for today. Please try again tomorrow!
            <br />
            If you need more queries, please call us at (312)-709-9987.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APILimitReached;
