import Link from "next/link";
import Image from "next/image";
import React from "react";

function RecentList({ recentChatData }) {
  // var recentList = [
  //   "Hopper Investment Analysis",
  //   "Etsy: Online Marketplace",
  //   "Line Chart",
  // ];
  return (
    <div className="space-y-4 h-full">
      {recentChatData.map((chatData, index) => (
        <div className="text-sm truncate">
          <Link key={index} href={`/chat/${chatData.id}`}>
            {chatData.id}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default RecentList;
