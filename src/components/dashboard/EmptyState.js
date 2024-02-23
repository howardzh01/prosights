import React from "react";
import Image from "next/image";
import SearchBar from "./SearchBar";

const EmptyState = ({
  companyDirectory,
  setCompanyDic,
  setCompanyCompetitors,
}) => {
  return (
    <div
      className="flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/backgroundPatternLight.svg')",
      }}
    >
      <div className="relative flex flex-col items-center justify-center h-2/3">
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-[0.12] rounded-full filter blur-[100px]" />
        </div>
        <div className="">
          <div className="flex flex-col-reverse md:flex-row justify-between">
            <div className="">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                Welcome!
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Which company are you interested in?
              </p>
            </div>

            <div className="">
              <Image
                src="/logo.png"
                alt="ProSights Logo"
                width={4096}
                height={4096}
                className="w-12 md:w-16 pb-4 md:pb-0"
              />
            </div>
          </div>
          {/* Search Bar */}
          <div className="content-section w-[36rem] pt-4">
            <SearchBar
              companyDirectory={companyDirectory}
              setCompany={setCompanyDic}
              setCompanyCompetitors={setCompanyCompetitors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
