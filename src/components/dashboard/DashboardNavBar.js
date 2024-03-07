import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@nextui-org/react";
import CountrySelector from "./CountrySelector";
import SearchBar from "./SearchBar";
import CompetitorContainer from "./CompetitorContainer";
import CompanyLogoSkeleton from "./CompanyLogoSkeleton";

const DashboardNavBar = ({
  companyDic,
  country,
  setCountry,
  downloadPDF,
  downloadExcel,
  emptyStateCompanyList,
  setCompanyDic,
  companyCompetitors,
  setCompanyCompetitors,
  crunchbaseDataPull,
  activeLevel1SectionName,
}) => {
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const downloadDropdownRef = useRef(null);

  // Download dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(event.target)
      ) {
        setShowDownloadDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [downloadDropdownRef]);
  return (
    <div className="z-50 bg-white w-full">
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
              className="w-9 h-9 mr-2 object-contain rounded-md"
              width={256}
              height={256}
              alt="Company Logo"
            />
          ) : crunchbaseDataPull === undefined ? (
            <Skeleton className="w-9 h-9 mr-2 rounded-md bg-customGray-50" />
          ) : (
            <div className="w-9 h-9 mr-2 text-2xl">
              <CompanyLogoSkeleton name={companyDic.displayedName} />
            </div>
          )}
          <p className="text-3xl font-bold text-gray-800 pl-1">
            {companyDic.displayedName}
          </p>
          {/* Section title */}
          <div className="sm:w-[5rem] xl:w-[15rem]">
            <div className="flex flex-row bg-customGray-700 text-white rounded-lg ml-3 2xl:ml-4 px-3 2xl:px-4 py-1 ">
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
              <p className="font-semibold truncate text-sm xl:text-base my-1 xl:my-0">
                {activeLevel1SectionName}
              </p>
            </div>
          </div>
          <div className="ml-2 2xl:ml-6">
            <CountrySelector country={country} setCountry={setCountry} />
          </div>
          {/* Dropdown for download options */}
          <div className="relative">
            <div
              className="group flex flex-row items-center ml-2 2xl:ml-4 hover:cursor-pointer hover:text-primary"
              id="menu-button"
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            >
              <p className="text-sm text-customGray-500 group-hover:text-primary xl:ml-2 2xl:ml-4">
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
                showDownloadDropdown ? "block" : "hidden"
              } origin-top-left absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
              ref={downloadDropdownRef} // Set the ref here
            >
              <div className="py-1" role="none">
                <button
                  className="hover:cursor-pointer hover:text-primary px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex="-1"
                  onClick={() =>
                    downloadPDF(
                      `${companyDic.displayedName} - ${country} (Full Report)`
                    )
                  }
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

          {/* <div className="ml-6 w-[24rem] 2xl:ml-16 2xl:w-[28rem] items-center">
            <SearchBar
              companyDirectory={companyDirectory}
              setCompany={setCompanyDic}
              setCompanyCompetitors={setCompanyCompetitors}
            />
          </div> */}
        </div>
        <CompetitorContainer
          targetCompany={companyDic}
          emptyStateCompanyList={emptyStateCompanyList}
          companyCompetitors={companyCompetitors}
          setCompanyCompetitors={setCompanyCompetitors}
        />
      </div>
      <hr className="border-none h-px bg-customGray-100 w-full mt-2" />
    </div>
  );
};

export default DashboardNavBar;
