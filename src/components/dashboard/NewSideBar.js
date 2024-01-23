import React, { useEffect } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";

function NewSideBar({ sections, activeSections }) {
  // Determine if we should extend the bar to cover multiple consecutive active sections
  const isSectionActive = (section) => activeSections[section.title];

  const scrollToSection = (sectionTitle) => {
    const sectionElement = document.getElementById(sectionTitle);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-customGray-900 h-full w-full px-6 py-4 flex flex-col">
      <Image
        src="/assets/fullLogoWhite.png"
        alt="ProSights logo"
        width={1024}
        height={1024}
        className="w-28"
      />
      <div className="mt-8 flex-grow relative overflow-y-auto overflow-x-hidden">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`py-2 text-sm flex items-center cursor-pointer hover:bg-primaryLight hover:rounded-tr-md hover:rounded-br-md hover:bg-opacity-20 transform transition duration-300 ${
              section.level === 1 ? "" : "ml-4"
            } text-customGray-25 border-l-2 border-primaryMedium ${
              isSectionActive(section)
                ? "text-primaryMedium border-opacity-100"
                : "border-opacity-0 hover:rounded-md"
            } pl-2 hover:translate-x-2`}
            onClick={() => scrollToSection(section.title)}
          >
            {section.title}
          </div>
        ))}
      </div>
      <div className={`flex flex-row items-center pt-4`}>
        <UserProfileButton />
      </div>
    </div>
  );
}

export default NewSideBar;
