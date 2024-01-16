import React, { useEffect } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";

function NewSideBar() {
  const sections = [
    {
      title: "Company Overview",
      level: 1,
    },
    {
      title: "Detailed Graphs",
      level: 1,
    },
    {
      title: "Headcount",
      level: 2,
    },
    {
      title: "Web Traffic",
      level: 2,
    },
    {
      title: "App Usage",
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
