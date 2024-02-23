import React, { useState } from "react";
import Image from "next/image";
import UserProfileButton from "../UserProfileButton";
import { API_LIMIT } from "../../constants";

function SideBar({
  sections,
  activeSections,
  apiUsage,
  navbarCalculatedHeight,
}) {
  const [showPopup, setShowPopup] = useState(false);
  // Determine if we should extend the bar to cover multiple consecutive active sections
  const isSectionActive = (section) => activeSections[section.id];

  // const isParentSectionActive = (section) => activeSections[section.id];

  const scrollToSection = (sectionTitle) => {
    const sectionElement = document.getElementById(sectionTitle);
    if (sectionElement) {
      // Temporarily set the scroll-margin-top to accommodate the navbar height
      const originalScrollMarginTop = sectionElement.style.scrollMarginTop;
      sectionElement.style.scrollMarginTop = `${navbarCalculatedHeight}px`;

      sectionElement.scrollIntoView();

      // Reset the scroll-margin-top after scrolling
      // This delay ensures the scroll action completes before resetting the style
      // setTimeout(() => {
      //   sectionElement.style.scrollMarginTop = originalScrollMarginTop;
      // }, 0);
    }
  };

  const expandedSections = sections
    .filter((section) => isSectionActive(section))
    .map((section) => section.parentId)
    .filter((parentId, index, self) => self.indexOf(parentId) === index); // This will remove duplicates

  return (
    <div className="bg-customGray-900 h-full w-full px-6 py-4 flex flex-col">
      <button
        onClick={() => scrollToSection(sections[0].id)}
        className="focus:outline-none"
      >
        <Image
          src="/assets/fullLogoWhite.png"
          alt="ProSights logo"
          width={128}
          height={128}
          priority
          className="w-28"
        />
      </button>
      <p className="pt-3 text-white text-base font-semibold">
        Queries Left: {apiUsage == null ? "--" : 200 - apiUsage}
      </p>
      <div className="mt-8 flex-grow relative overflow-y-auto overflow-x-hidden">
        {sections.map((section, index) => {
          if (
            section.level === 2 &&
            !expandedSections.includes(section.parentId)
          ) {
            return;
          }
          return (
            <div key={section.id} className="flex flex-row">
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
      <div className="flex relative z-50">
        <div
          className="mt-4 group cursor-pointer"
          onMouseOver={() => setShowPopup(true)}
          onMouseOut={() => setShowPopup(false)}
        >
          <Image
            src={
              showPopup ? "/assets/helpActive.svg" : "/assets/helpInactive.svg"
            }
            alt="Help Icon"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </div>
        <div
          id="infoPopup"
          className="absolute bg-customGray-700 text-white rounded-lg px-4 py-2 text-center w-64 bottom-24 md:bottom-8 text-sm"
          style={{
            display: showPopup ? "block" : "none",
          }}
        >
          Call us at (312)-709-9987 and we'll help you ASAP
        </div>
      </div>
      <div className={`flex flex-row items-center pt-4`}>
        <UserProfileButton />
      </div>
    </div>
  );
}

export default SideBar;
