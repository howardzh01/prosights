import Link from "next/link";
import Image from "next/image";
import React from "react";

function RecentList({ recentChatTitles }) {
  // var recentList = [
  //   "Hopper Investment Analysis",
  //   "Etsy: Online Marketplace",
  //   "Line Chart",
  // ];
  console.log(recentChatTitles);
  return (
    <div className="space-y-4 h-full">
      {recentChatTitles.map((title, index) => (
        <div key={index} className="text-sm">
          {title}
        </div>
      ))}
    </div>
  );
}

export default RecentList;
