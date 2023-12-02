import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center text-black p-10">
        <div className="mb-2">
          <p className="text-primary border border-primary px-6 py-2 rounded-3xl font-bold text-sm">
            Insight to Action ⚡️
          </p>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          The AI Copilot for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009AFF] to-[#B84CEB]">
            Investors
          </span>
          .
        </h1>
        <p className="mb-6 text-lg font-light max-w-2xl text-center">
          Understand any company in 30 seconds by chatting with ProSights. We
          help you make better decisions by analyzing alternative data.
        </p>
        <div className="flex gap-4">
          <Link
            href="#"
            className="bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-100"
          >
            Try for Free
          </Link>
          <Link
            href="#"
            className="py-2 px-4 rounded-md border border-white hover:border-gray-300"
          >
            Watch demo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
