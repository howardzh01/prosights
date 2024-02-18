import React from "react";
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
          ) : (
            <Skeleton className="w-10 h-10 mr-2 rounded-md bg-customGray-50" />
          )}
          <p className="text-3xl font-bold text-gray-800 pl-1">
            {companyDic.displayedName}
          </p>
          <div className="flex flex-row bg-customGray-50 rounded-2xl ml-4 px-4 py-2 ">
            <Image
              src={`/assets/${activeLevel1SectionName.replace(
                /\s/g,
                ""
              )}Icon.svg`}
              alt="Section Icon"
              width={32}
              height={32}
              className={`w-4 mr-2 filter invert`}
            />
            <p className="font-semibold">{activeLevel1SectionName}</p>
          </div>
          <CountrySelector country={country} setCountry={setCountry} />
          <div
            className="group flex flex-row items-center ml-8 hover:cursor-pointer hover:text-primary"
            onClick={downloadPDF}
          >
            <div className="group">
              <Image
                src="/assets/downloadInactive.svg"
                className="w-4 h-4 object-contain mr-1 group-hover:hidden"
                width={256}
                height={256}
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-4 h-4 object-contain mr-1 hidden group-hover:block"
                width={256}
                height={256}
              />
            </div>
            <p className="text-sm text-customGray-500 group-hover:text-primary">
              Download PDF
            </p>
          </div>
          <div
            className="group flex flex-row items-center ml-4 hover:cursor-pointer hover:text-primary"
            onClick={() => downloadExcel("")}
          >
            <div className="group">
              <Image
                src="/assets/downloadInactive.svg"
                className="w-4 h-4 object-contain mr-1 group-hover:hidden"
                width={256}
                height={256}
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-4 h-4 object-contain mr-1 hidden group-hover:block"
                width={256}
                height={256}
              />
            </div>
            <p className="text-sm text-customGray-500 group-hover:text-primary">
              Download XLS
            </p>
          </div>
          <div className="ml-4 w-[24rem] items-center">
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
