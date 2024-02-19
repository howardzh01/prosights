import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@nextui-org/react";
import CountrySelector from "./CountrySelector"; // Adjust the import path as necessary
import SearchBar from "./SearchBar"; // Adjust the import path as necessary
import CompetitorContainer from "./CompetitorContainer"; // Adjust the import path as necessary

const DashboardNavBar = ({
  companyDic,
  country,
  setCountry,
  downloadPDF,
  downloadExcel,
  companyDirectory,
  setCompanyDic,
  companyCompetitors,
  setCompanyCompetitors,
  crunchbaseDataPull,
  activeLevel1SectionName,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // Inside your component
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div className="z-50 pt-4 pb-2 sticky top-0 bg-white w-full">
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row items-center">
          {crunchbaseDataPull?.[companyDic.displayedName]?.["fields"]?.[
            "image_url"
          ] ? (
            <Image
              src={
                crunchbaseDataPull[companyDic.displayedName]["fields"][
                  "image_url"
                ]
              }
              className="w-10 h-10 mr-2 object-contain rounded-md"
              width={256}
              height={256}
              alt="Company Logo"
            />
          ) : crunchbaseDataPull === undefined ? (
            <Skeleton className="w-10 h-10 mr-2 rounded-md bg-customGray-50" />
          ) : (
            <div className="w-10 h-10 mr-2 rounded-md bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">--</p>
            </div>
          )}
          <p className="text-3xl font-bold text-gray-800 pl-1">
            {companyDic.displayedName}
          </p>
          {/* Section title */}
          <div className="w-[15rem]">
            <div className="flex flex-row bg-customGray-700 text-white rounded-lg ml-4 px-4 py-1 ">
              <Image
                src={`/assets/${activeLevel1SectionName.replace(
                  /\s/g,
                  ""
                )}Icon.svg`}
                alt="Section Icon"
                width={32}
                height={32}
                className={`w-4 mr-2`}
              />
              <p className="font-semibold">{activeLevel1SectionName}</p>
            </div>
          </div>

          <CountrySelector country={country} setCountry={setCountry} />

          {/* Dropdown for download options */}
          <div className="relative">
            <div
              className="group flex flex-row items-center ml-4 hover:cursor-pointer hover:text-primary"
              id="menu-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <p className="text-sm text-customGray-500 group-hover:text-primary ml-4">
                Download
              </p>
              <div className="group">
                <Image
                  src="/assets/downloadInactive.svg"
                  className="w-4 h-4 object-contain ml-2 group-hover:hidden"
                  width={256}
                  height={256}
                />
                <Image
                  src="/assets/downloadActive.svg"
                  className="w-4 h-4 object-contain ml-2 hidden group-hover:block"
                  width={256}
                  height={256}
                />
              </div>
            </div>

            {/* Dropdown panel, show/hide based on dropdown state. */}
            <div
              className={`${
                showDropdown ? "block" : "hidden"
              } origin-top-left absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
              ref={dropdownRef} // Set the ref here
            >
              <div className="py-1" role="none">
                <button
                  className="hover:cursor-pointer hover:text-primary px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex="-1"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>
                <button
                  className="hover:cursor-pointer hover:text-primary px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex="-1"
                  onClick={() => downloadExcel("")}
                >
                  Download XLS
                </button>
              </div>
            </div>
          </div>

          <div className="ml-16 w-[28rem] items-center">
            <SearchBar
              companyDirectory={companyDirectory}
              setCompany={setCompanyDic}
              setCompanyCompetitors={setCompanyCompetitors}
            />
          </div>
        </div>
        <CompetitorContainer
          companyCompetitors={companyCompetitors}
          setCompanyCompetitors={setCompanyCompetitors}
        />
      </div>
      <hr className="border-none h-px bg-black w-full mt-2" />
    </div>
  );
};

export default DashboardNavBar;
