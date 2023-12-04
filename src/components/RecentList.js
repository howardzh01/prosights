import Link from "next/link";
import Image from "next/image";
import React from "react";

function RecentList() {
  var recentList = [
    "Hopper Investment Analysis",
    "Etsy: Online Marketplace",
    "Line Chart",
  ];
  return (
    <div className="space-y-4">
      <div className="font-medium text-xs">Recent</div>
      {recentList.map((title, index) => (
        <div className="text-sm"> {title} </div>
      ))}
    </div>
  );
}

export default RecentList;
