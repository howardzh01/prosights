import React, { useEffect } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";

function NewSideBar({ sections, activeSections }) {
  // Determine if we should extend the bar to cover multiple consecutive active sections
  const isSectionActive = (section) => activeSections[section.id];

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
        width={128}
        height={128}
        className="w-28"
      />
      <div className="mt-8 flex-grow relative overflow-y-auto overflow-x-hidden">
        {sections.map((section, index) => (
          <div className="flex flex-row">
            {/* {section.level === 1 && (
              <Image
                src={`/assets/${section.title.replace(/\s/g, "")}Icon.svg`}
                alt="Section Icon"
                width={1024}
                height={1024}
                className="w-4"
              />
            )} */}
            <div
              className={`py-2 pr-2 text-sm flex items-center cursor-pointer hover:bg-primaryLight hover:rounded-tr-md hover:rounded-br-md hover:bg-opacity-20 transform transition duration-300 ${
                section.level === 1 ? "" : "ml-8"
              } text-customGray-25 border-l-2 border-primaryMedium ${
                isSectionActive(section)
                  ? "text-primaryMedium border-opacity-100"
                  : "border-opacity-0 hover:rounded-md"
              } pl-2 hover:translate-x-2`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.level === 1 && (
                <Image
                  src={`/assets/${
                    isSectionActive(section) ? "Active" : ""
                  }${section.title.replace(/\s/g, "")}Icon.svg`}
                  alt="Section Icon"
                  width={32}
                  height={32}
                  className="w-4 mr-2"
                />
              )}
              {section.title}
            </div>
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
