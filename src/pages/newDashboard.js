import React, { useEffect, useState } from "react";
import NewSideBar from "../components/dashboard/NewSideBar";
import SearchBar from "../components/dashboard/SearchBar";
import Image from "next/image";

function NewDashboard() {
  const [company, setCompany] = useState("StockX");
  const [companyLogo, setCompanyLogo] = useState(
    "https://imgtr.ee/images/2024/01/16/78d792f651a4f43e5f728d3026af4cb3.png"
  );
  const [companyLocation, setCompanyLocation] = useState("US");

  return (
    <div className="flex flex-row">
      <div className="w-64 h-screen">
        <NewSideBar />
      </div>
      <div className="flex-grow bg-white flex flex-col items-center px-16">
        <div className="w-[36rem] mt-2">
          <SearchBar />
        </div>
        <div className="mt-12 flex flex-row justify-between w-full items-center">
          <div className="flex flex-row items-center">
            <Image
              src={companyLogo}
              alt="Company Logo"
              className="w-10 h-10 mr-2 object-contain"
              width={256}
              height={256}
            />
            <p className="text-4xl font-bold text-gray-800">{company}</p>
            <select
              className="border-customGray-50 text-customGray-500 rounded-md font-nunitoSans text-sm font-normal text-left focus:outline-none focus:ring-0 ml-6"
              onChange={(e) => {
                const newCompanyLocation = e.target.value;
                setCompanyLocation(newCompanyLocation);
              }}
            >
              <option value="us">US</option>
              <option value="asia">Asia</option>
            </select>
          </div>
          <div className="flex flex-row items-center">
            <Image
              src="/assets/compare.svg"
              alt="Compare"
              className="w-4 h-4 mr-1 object-contain"
              width={128}
              height={128}
            />
            <p className="text-base text-customGray-500">Compare</p>
          </div>
        </div>
        <div className="mt-12 w-full">
          <p className="text-2xl font-bold text-gray-800">Company Overview</p>
          <hr className="border-t border-customGray-50 mt-2" />
        </div>
      </div>
    </div>
  );
}

export default NewDashboard;
