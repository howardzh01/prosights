import Link from "next/link";
import Image from "next/image";
import React from "react";
import UserProfileButton from "./UserProfileButton";
import RecentList from "./RecentList";

function SideBar() {
  return (
    <div className="relative flex flex-col text-white h-full w-full pl-4 items-left">
      <div className="flex flex-row items-center ">
        <Image
          src="/logo.png"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl">ProSights</h1>
      </div>
      <div className="flex justify-center space-x-2 mt-8 mr-16 p-2 rounded-xl bg-customTeal-100">
        <Image
          src="/assets/plus.png"
          alt="+"
          width={12}
          height={12}
          className="rounded-full object-contain"
        />

        <span className="font-medium text-sm">New Chat</span>
      </div>
      <div className="mt-12">
        <RecentList />
      </div>

      <div className="flex flex-row items-center absolute bottom-0">
        <UserProfileButton />
      </div>
    </div>
  );
}

export default SideBar;
