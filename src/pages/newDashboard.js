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
  const [companyAbout, setCompanyAbout] = useState(
    "StockX is an e-commerce platform specializing in authenticated resale of limited-edition sneakers and streetwear."
  );
  const [companyBusinessModel, setCompanyBusinessModel] =
    useState(`Transaction Fees: Charges sellers a percentage fee on each sale.
  Processing Fees: Collects a fee from buyers for each transaction.
  Transaction Fees: Charges sellers a percentage fee on each sale.
  Processing Fees: Collects a fee from buyers for each transaction.`);
  const [companyFoundedYear, setCompanyFoundedYear] = useState(2015);
  const [companyHeadcount, setCompanyHeadcount] = useState(500);
  const [companyHeadquarters, setCompanyHeadquarters] = useState("Detroit, MI");
  const [companyValuation, setCompanyValuation] = useState("3.1B"); // Some of these might need to convert formatting depending on API output
  const [companyLastRoundSize, setCompanyLastRoundSize] = useState("60M");
  const [companyLastDealType, setCompanyLastDealType] = useState("Series E1");

  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <NewSideBar />
      </div>
      {/* Main Content */}
      <div className="flex-grow bg-white flex flex-col items-center px-10">
        {/* Search Bar */}
        <div className="w-[36rem] mt-2">
          <SearchBar />
        </div>
        {/* Company name, country, and comparing section */}
        <div className="mt-8 flex flex-row justify-between w-full items-center">
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
        {/* Company overview section */}
        <div className="mt-12 w-full">
          <p className="text-2xl font-semibold text-gray-800 ml-2">
            Company Overview
          </p>
          <hr className="border-t border-customGray-50 mt-2" />
          <div className="flex flex-row mt-6 mx-4">
            {/* Left Side */}
            <div className="flex flex-col w-1/2 mr-12">
              <div className="text-lg font-semibold text-gray-800">About</div>
              <p className="text-base text-customGray-800 mt-2">
                {companyAbout}
              </p>
              <div className="text-lg font-semibold text-gray-800 mt-8">
                Business Model
              </div>
              <p className="text-base text-customGray-800 mt-2 whitespace-pre-line">
                {companyBusinessModel}
              </p>
            </div>
            {/* Right Side */}
            <div className="grid grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  {companyFoundedYear}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Founded
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  {companyHeadcount}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Headcount
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  {companyHeadquarters}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Headquarters
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  ${companyValuation}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Valuation
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  ${companyLastRoundSize}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Last Round
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-primary font-bold text-3xl">
                  {companyLastDealType}
                </div>
                <div className="text-sm text-customGray-500 font-light mt-1">
                  Last Deal Type
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mx-4">
            <div className="w-1/2 mr-8">
              <p className="text-lg font-semibold text-gray-800 mt-8 mb-4">
                Funding
              </p>
              <div className="bg-white drop-shadow-sm rounded-md">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-primaryLight text-center text-sm font-medium">
                      <th className="px-4 py-2 rounded-tl-md">Round</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Valuation</th>
                      <th className="px-4 py-2">Raised</th>
                      <th className="px-4 py-2 rounded-tr-md">
                        Lead Investors
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center text-sm">
                      <td className="px-4 py-2">Secondary</td>
                      <td className="px-4 py-2">Apr 2023</td>
                      <td className="px-4 py-2">$3.1B</td>
                      <td className="px-4 py-2">$195M</td>
                      <td className="px-4 py-2">
                        Altimeter Capital, Dragon Investment Group
                      </td>
                    </tr>
                    <tr className="text-center text-sm">
                      <td className="px-4 py-2">Secondary</td>
                      <td className="px-4 py-2">Apr 2023</td>
                      <td className="px-4 py-2">$3.1B</td>
                      <td className="px-4 py-2">$195M</td>
                      <td className="px-4 py-2">
                        Altimeter Capital, Dragon Investment Group
                      </td>
                    </tr>
                    <tr className="text-center text-sm">
                      <td className="px-4 py-2">Secondary</td>
                      <td className="px-4 py-2">Apr 2023</td>
                      <td className="px-4 py-2">$3.1B</td>
                      <td className="px-4 py-2">$195M</td>
                      <td className="px-4 py-2">
                        Altimeter Capital, Dragon Investment Group
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="">
              <p className="text-lg font-semibold text-gray-800 mt-8 mb-4">
                M&A
              </p>
              <div className="bg-white drop-shadow-sm rounded-md">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-primaryLight text-center text-sm font-medium">
                      <th className="px-4 py-2 rounded-tl-md">Company</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Valuation</th>
                      <th className="px-4 py-2 rounded-tr-md">Seller</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center text-sm">
                      <td className="px-4 py-2">Scout</td>
                      <td className="px-4 py-2">Apr 2023</td>
                      <td className="px-4 py-2">$3.1B</td>
                      <td className="px-4 py-2">Goodwater Capital</td>
                    </tr>
                    <tr className="text-center text-sm">
                      <td className="px-4 py-2">Scout</td>
                      <td className="px-4 py-2">Apr 2023</td>
                      <td className="px-4 py-2">$3.1B</td>
                      <td className="px-4 py-2">Goodwater Capital</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDashboard;
