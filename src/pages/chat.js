import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox";
import SideBar from "../components/SideBar";
import Head from "next/head";

function App() {
  return (
    <div className="bg-customPurple-100">
      <Head>
        <title>ProSights Chat</title>
      </Head>

      <div className="flex h-screen ">
        {/* Sidebar */}
        <div className="flex flex-row justify-center w-1/4 my-5 border-right">
          {/* <div className="w-full"> */}
          <SideBar />
          {/* </div> */}
        </div>
        {/* Main content */}
        <div className="relative w-3/4 bg-white my-4 rounded-xl">
          <div className="flex justify-center items-center mb-6 pt-4">
            <h2 className="font-semibold text-lg">Justin Wu</h2>
            <div>{/* Settings or other icons */}</div>
          </div>

          {/* Chat content */}
          <div className="bg-white rounded-lg shadow p-6 overflow-y-scroll">
            {/* Chat messages */}

            {/* ... */}
          </div>

          {/* Search area */}
          <div className="flex flex-row justify-center w-full my-5 absolute bottom-0">
            <div className="w-96">
              <SearchBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
