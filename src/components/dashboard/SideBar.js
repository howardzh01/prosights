import React, { useEffect } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";

function SideBar({ sections, activeSections }) {
  // Determine if we should extend the bar to cover multiple consecutive active sections
  const isSectionActive = (section) => activeSections[section.id];

  // const isParentSectionActive = (section) => activeSections[section.id];

  const scrollToSection = (sectionTitle) => {
    const sectionElement = document.getElementById(sectionTitle);
    if (sectionElement) {
      sectionElement.scrollIntoView();
    }
  };

  const expandedSections = sections
    .filter((section) => isSectionActive(section))
    .map((section) => section.parentId)
    .filter((parentId, index, self) => self.indexOf(parentId) === index); // This will remove duplicates

  return (
    <div className="bg-customGray-900 h-full w-full px-6 py-4 flex flex-col">
      <Image
        src="/assets/fullLogoWhite.png"
        alt="ProSights logo"
        width={128}
        height={128}
        priority
        className="w-28"
      />
      {/* <p className="pt-3 text-white text-base font-semibold">
        Queries Left: 50
      </p> */}
      <div className="mt-8 flex-grow relative overflow-y-auto overflow-x-hidden">
        {sections.map((section, index) => {
          if (
            section.level === 2 &&
            !expandedSections.includes(section.parentId)
          ) {
            return;
          }
          return (
            <div className="flex flex-row">
              <div
                className={`py-2 pr-2 text-sm flex items-center ${
                  section.level === 1 ? "" : "ml-8"
                } ${
                  Object.keys(activeSections).length === 0
                    ? "text-customGray-500 cursor-default"
                    : "text-customGray-25 cursor-pointer hover:bg-primaryLight hover:rounded-tr-md hover:rounded-br-md hover:bg-opacity-20 transform transition duration-300 hover:translate-x-2"
                } border-l-2 border-primaryMedium ${
                  isSectionActive(section)
                    ? "text-primaryMedium border-opacity-100"
                    : "border-opacity-0 hover:rounded-md"
                } pl-2`}
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
                    className={`w-4 mr-2 ${
                      Object.keys(activeSections).length === 0
                        ? "opacity-20"
                        : "opacity-100"
                    }`}
                    priority={index === 0}
                  />
                )}
                {section.title}
              </div>
            </div>
          );
        })}
      </div>
      <div className={`flex flex-row items-center pt-4`}>
        <UserProfileButton />
      </div>
    </div>
  );
}

export default SideBar;
