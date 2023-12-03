import Link from "next/link";
import Image from "next/image";
import React from "react";

function SideBar() {
  return (
    <div className="relative flex flex-col bg-070522 text-white w-full px-4">
      <div className="py-5">
        <h1 className="text-xl font-bold">ProSights</h1>
      </div>
      <div className="flex justify-center space-x-2 p-2 rounded-md bg-customTeal-100">
        <span>+</span>
        <span>New Chat</span>
      </div>
      <div className="mt-12 space-y-2">
        <div>Recent</div>
      </div>
      <div className="flex flex-row items-center absolute bottom-0">
        <Image
          src="/assets/avatar_jw.png"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="ml-2">Justin Wu</div>
      </div>
    </div>
  );
}

export default SideBar;
