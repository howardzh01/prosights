import Link from "next/link";
import Image from "next/image";
import React from "react";
import UserProfileButton from "./UserProfileButton";

function SideBar() {
  return (
    <div className="relative flex flex-col text-white h-full w-full px-4">
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
      <div className="flex justify-center space-x-2 mt-8 p-2 rounded-xl bg-customTeal-100">
        <span>+</span>
        <span>New Chat</span>
      </div>
      <div className="mt-12 space-y-2">
        <div>Recent</div>
      </div>
      <div className="flex flex-row items-center absolute bottom-0">
        <UserProfileButton />
      </div>
    </div>
  );
}

export default SideBar;
