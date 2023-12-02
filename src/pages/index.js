import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import styles from "./index.module.css";

function App() {
  return (
    <div className="bg-gradient-to-br from-primaryInfusion via-white to-primaryInfusion h-screen">
      <Navbar />
      <div className="flex flex-col items-center text-black mt-24">
        <div className="mb-6">
          <p className="text-primary border border-primary px-6 py-2 rounded-3xl font-semibold">
            Insight to Action ⚡️
          </p>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
          The AI Copilot for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009AFF] to-[#B84CEB]">
            Investors
          </span>
          .
        </h1>
        <p className="mb-20 text-xl font-light max-w-2xl text-center leading-relaxed">
          Understand any company in 30 seconds by chatting with ProSights.{" "}
          <br />
          We help you make better decisions by analyzing alternative data.
        </p>
        <div className="flex items-center">
          <Link
            href="#"
            className="flex flex-row items-center bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-600 drop-shadow-lg mr-12"
          >
            <p className="mr-4 text-lg">Try for Free</p>
            <Image
              src="/assets/topRightArrow.png"
              alt="Go"
              className="w-3 h-3"
              width={12}
              height={12}
            />
          </Link>
          <Link href="#" className="flex flex-row items-center px-4 rounded-md">
            <Image
              src="/assets/play.png"
              alt="Play"
              className="w-10 h-10 mr-3 drop-shadow-md"
              width={100}
              height={100}
            />
            <div className="flex flex-col">
              <p className="text-primary text-lg">Watch demo</p>
              <p className="text-sm text-customGray-600">1 min</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className={styles.ellipseWrapper}>
          <div className={styles.ellipse} />
        </div>
        <Image
          src="/assets/preview.png"
          alt="Play"
          className="w-full h-full drop-shadow-md px-16 object-contain mt-36"
          width={4096}
          height={4096}
        />
      </div>
    </div>
  );
}

export default App;
