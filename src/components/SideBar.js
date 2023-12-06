import Link from "next/link";
import Image from "next/image";
import React from "react";
import UserProfileButton from "./UserProfileButton";
import NewChatButton from "./NewChatButton";
import RecentList from "./RecentList";

function SideBar({ setIsEmptyState, recentChatTitles }) {
  return (
    <div className="relative flex flex-col text-white h-full w-full pl-4 items-left">
      <Image
        src="/assets/fullLogoWhite.png"
        alt="ProSights logo"
        width={1024}
        height={1024}
        className="w-28"
      />
      <div className="w-32">
        <NewChatButton setIsEmptyState={setIsEmptyState} />
      </div>

      {/* <div className="flex justify-center space-x-2 mt-8 mr-16 p-2 rounded-xl bg-customTeal-100">
        <Image
          src="/assets/plus.png"
          alt="+"
          width={12}
          height={12}
          className="rounded-full object-contain"
        />

        <span className="font-medium text-sm">New Chat</span>
      </div> */}
      <div className="mt-12 font-medium text-xs">Recent</div>
      <div className="my-4 overflow-y-auto flex-grow">
        <RecentList recentChatTitles={recentChatTitles} />
      </div>

      <div className={`flex flex-row items-center`}>
        <UserProfileButton />
      </div>
    </div>
  );
}

export default SideBar;
