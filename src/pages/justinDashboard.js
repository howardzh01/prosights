import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Dashboard from "./dashboard";

function JustinDashboard() {
  return (
    <>
      <h1 className="w-full flex flex-row justify-center bg-red-500 text-white">
        Yo. Yo. Yo. Yo. Yo. Yo. Yo. This is your dashboard, Justin dawg
      </h1>
      <Dashboard enableCrunchbase={false} enableOnlyWebTraffic={true} />
    </>
  );
}

export default JustinDashboard;
