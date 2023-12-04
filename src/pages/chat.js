import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox";
import SideBar from "../components/SideBar";
import ChatEmptyState from "../components/ChatEmptyState";
import HelpButton from "../components/HelpButton";
import Head from "next/head";

function App() {
  return (
    <div className="bg-customPurple-100">
      <Head>
        <title>ProSights Chat</title>
      </Head>

      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <div className="absolute top-[-2%] left-[-8%] flex justify-center items-center w-[116%] h-[104%] ">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-25 rounded-full filter blur-[72px]" />
        </div>

        <div className="flex flex-row justify-center w-64 my-5 border-right">
          <SideBar />
        </div>
        {/* Main content */}
        <div className="relative w-full bg-white mx-2 my-4 rounded-xl opacity-100">
          {/* Chat content */}
          <ChatEmptyState />
          <div className="absolute top-8 right-8">
            <HelpButton />
          </div>

          {/* Search area */}
          <div className="flex flex-row justify-center px-24 w-full my-5 absolute bottom-4">
            <div className="w-full">
              <SearchBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
