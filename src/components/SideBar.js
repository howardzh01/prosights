import Link from "next/link";
import Image from "next/image";
import React from "react";

function SideBar() {
  var user = "Justin Wu";
  var avatar_path = "/assets/avatar_jw.png";
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
        <Image
          src={avatar_path}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="ml-2">{user}</div>
      </div>
    </div>
  );
}

export default SideBar;
