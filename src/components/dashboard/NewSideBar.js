import React, { useEffect } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";

function NewSideBar() {
  const sections = [
    {
      title: "Overview",
      level: 1,
    },
    {
      title: "Headcount",
      level: 1,
    },
    {
      title: "Website Traffic",
      level: 1,
    },
    {
      title: "Visits Breakdown",
      level: 2,
    },
    {
      title: "Traffic Momentum",
      level: 2,
    },
    {
      title: "Traffic Quality",
      level: 2,
    },
    {
      title: "Consumer Spend",
      level: 2,
    },
    {
      title: "Ad Spend",
      level: 2,
    },
    {
      title: "Market Share",
      level: 2,
    },
  ];

  return (
    <div className="bg-customGray-800 h-full px-6 py-4 flex flex-col">
      <Image
        src="/assets/fullLogoWhite.png"
        alt="ProSights logo"
        width={1024}
        height={1024}
        className="w-28"
      />
      <div className="mt-8 flex-grow">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`mt-4 text-base ${
              section.level === 1 ? "" : "ml-4"
            } text-customGray-25`}
          >
            {section.title}
          </div>
        ))}
      </div>
      <div className={`flex flex-row items-center`}>
        <UserProfileButton />
      </div>
    </div>
  );
}

export default NewSideBar;
