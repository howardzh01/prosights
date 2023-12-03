import Link from "next/link";
import Image from "next/image";
import React from "react";
import CompanySuggestions from "../components/CompanySuggestions";

function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center mt-12 p-6 ">
      <div className="">
        <div className="flex flex-row justify-between">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-800 mb-3 ">
              Hey, I’m ProSights
            </h1>
            <p className="text-gray-600 mb-6">
              Which company are you interested in?
            </p>
          </div>

          <div className="">
            <Image
              src="/logo.png"
              alt="ProSights Logo"
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className="">
          <CompanySuggestions />
        </div>
      </div>
    </div>
  );
}

export default ChatEmptyState;
