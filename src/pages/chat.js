import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox";
import SideBar from "../components/SideBar";
import ChatEmptyState from "../components/ChatEmptyState";
import ChatFullState from "../components/ChatFullState";
import Head from "next/head";

function App() {
  return (
    <div className="bg-customPurple-100">
      <Head>
        <title>ProSights Chat</title>
      </Head>

      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <div className="absolute top-[-2%] left-[-8%] flex justify-center items-center w-[116%] h-[104%]">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-25 rounded-full filter blur-[100px]" />
        </div>
        <div className="flex flex-row justify-center w-48 my-5 border-right">
          <SideBar />
        </div>
        {/* Main content */}
        <div className="flex flex-col justify-between w-full bg-background mx-2 my-4 px-24 rounded-xl opacity-100 z-10">
          {/* Chat content */}
          {/* <ChatEmptyState /> */}
          <ChatFullState />

          {/* Search area */}
          <div className="flex flex-row justify-center w-full my-5">
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
