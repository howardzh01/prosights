import React, { useEffect, useState } from "react";
import NewSideBar from "../components/dashboard/NewSideBar";
import SearchBar from "../components/dashboard/SearchBar";
import Image from "next/image";
import useSWR from "swr";
import { useUser } from "@clerk/clerk-react";
import {
  getGeoTrafficData,
  getHeadCount,
  getTrafficData,
  getCrunchbaseData,
  getCompanyDescription,
} from "../api";
import { RELEVANT_CONTINENTS } from "../constants";
import HeadCountSignal from "../components/signals/HeadCountSignal";
import { createContext } from "react";
import ChartModal from "../components/ChartModal";
import HeadCountChart from "../components/charts/HeadCountChart";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function NewDashboard() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [company, setCompany] = useState("stockx");
  const [companyLogo, setCompanyLogo] = useState(
    "https://imgtr.ee/images/2024/01/16/78d792f651a4f43e5f728d3026af4cb3.png"
  );
  const [country, setCountry] = useState("US");
  const [companyAbout, setCompanyAbout] = useState(
    "StockX is an e-commerce platform specializing in authenticated resale of limited edition sneakers and streetwear."
  );
  const [companyBusinessModel, setCompanyBusinessModel] =
    useState(`Transaction Fees: Charges sellers a percentage fee on each sale.
  Processing Fees: Collects a fee from buyers for each transaction.
  Transaction Fees: Charges sellers a percentage fee on each sale.`);
  const [companyFoundedYear, setCompanyFoundedYear] = useState(2015);
  const [companyHeadcount, setCompanyHeadcount] = useState(500);
  const [companyHeadquarters, setCompanyHeadquarters] = useState("Detroit, MI");
  const [companyValuation, setCompanyValuation] = useState("3.1B"); // Some of these might need to convert formatting depending on API output
  const [companyLastRoundSize, setCompanyLastRoundSize] = useState("60M");
  const [companyLastDealType, setCompanyLastDealType] = useState("Series E1");

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();

  // API Data
  const { data: headCountData, error: headCountError } = useSWR(
    user && company ? [`/api/private/getHeadCount`, user.id, company] : null,
    getHeadCount,
    { revalidateOnFocus: false }
  );
  // const { data: webTrafficData, error: webTrafficError } = useSWR(
  //   user && company && country
  //     ? [`/api/private/getWebTrafficData`, company + ".com", country]
  //     : null,
  //   (url, companyUrl, country) => {
  //     console.log(companyUrl);
  //     return getTrafficData(url, user, companyUrl, country);
  //   }
  // );
  const { data: webTrafficData, error: webTrafficError } = useSWR(
    user && company && country
      ? [`/api/private/getWebTrafficData`, user.id, company + ".com", country]
      : null,

    getTrafficData,
    { revalidateOnFocus: false }
  );
  const { data: webTrafficGeoData, error: webTrafficGeoError } = useSWR(
    user && company
      ? [
          `/api/private/getWebTrafficGeoData`,
          user.id,
          company + ".com",
          RELEVANT_CONTINENTS,
        ]
      : null,
    getGeoTrafficData,
    { revalidateOnFocus: false }
  );

  const { data: crunchbaseData, error: crunchbaseError } = useSWR(
    user && company
      ? [`/api/private/getCrunchbaseData`, user.id, company]
      : null,
    getCrunchbaseData,
    { revalidateOnFocus: false }
  );
  const { data: companyDescription, error: companyDescriptionError } = useSWR(
    user && company ? [`/api/private/getCompanyDescription`, company] : null,
    ([url, company]) => {
      return getCompanyDescription([
        url,
        user.id,
        company,
        // crunchbaseCompanyDescription,
      ]);
    },
    { revalidateOnFocus: false }
  );

  return (
    <>
      <SelectedChartContext.Provider
        value={{ selectedChart, setSelectedChart }}
      >
        <ChartDataContext.Provider value={{ chartData, setChartData }}>
          <ChartModal
            open={!!selectedChart && !!chartData}
            setOpen={() => {
              setSelectedChart("");
              setChartData(null);
            }}
            selectedChart={selectedChart}
            chartData={chartData}
          />
          <div className="flex flex-row">
            {/* Sidebar */}
            <div className="w-60 h-screen">
              <NewSideBar />
            </div>
            {/* Main Content */}
            <div className="flex-grow bg-white flex flex-col items-center px-10">
              {/* Search Bar */}
              <div className="w-[36rem] mt-2">
                <SearchBar />
              </div>
              {/* Company name, country, and comparing section */}
              <div className="mt-6 flex flex-row justify-between w-full items-center">
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
                    className="h-10 drop-shadow-sm border-customGray-50 text-customGray-500 rounded-md font-nunitoSans text-sm font-normal text-left focus:outline-none focus:ring-0 ml-6"
                    onChange={(e) => {
                      const newCompanyLocation = e.target.value;
                      setCountry(newCompanyLocation);
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
              {/* Company overview section; TODO: MAKE THIS A SEPARATE COMPONENT */}
              <div className="mt-8 w-full mx-4">
                <p className="text-2xl font-semibold text-gray-800 ml-2">
                  Overview
                </p>
                <hr className="border-t border-customGray-50 mt-2" />
                <div className="flex flex-row mt-4 mx-4">
                  {/* About & Business Model */}
                  <div className="flex flex-col w-1/2 mr-12">
                    <div className="text-base font-semibold text-gray-800">
                      About
                    </div>
                    <p className="text-sm text-customGray-800 leading-relaxed mt-1">
                      {companyAbout}
                    </p>
                    <div className="text-base font-semibold text-gray-800 mt-6">
                      Business Model
                    </div>
                    <p className="text-sm text-customGray-800 whitespace-pre-line leading-relaxed mt-1">
                      {companyBusinessModel}
                    </p>
                  </div>
                  {/* Basic Stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "min-content max-content 1fr",
                      gridTemplateRows: "auto auto",
                      columnGap: "2.5rem",
                    }}
                  >
                    <div
                      className="flex flex-col items-start mr-8"
                      style={{ gridRow: "1", gridColumn: "1" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        {companyFoundedYear}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Founded
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start mr-8"
                      style={{ gridRow: "1", gridColumn: "2" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        {companyHeadcount}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Headcount
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start"
                      style={{ gridRow: "1", gridColumn: "3" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        {companyHeadquarters}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Headquarters
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start"
                      style={{ gridRow: "2", gridColumn: "1" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        ${companyValuation}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Valuation
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start"
                      style={{ gridRow: "2", gridColumn: "2" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        ${companyLastRoundSize}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Last Round
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start"
                      style={{ gridRow: "2", gridColumn: "3" }}
                    >
                      <div className="text-primary font-bold text-4xl">
                        {companyLastDealType}
                      </div>
                      <div className="text-sm text-customGray-500 font-light mt-1">
                        Last Deal Type
                      </div>
                    </div>
                  </div>
                </div>
                {/* Funding and M&A Tables */}
                <div className="flex space-x-4 mx-4 mt-6">
                  <div className="w-3/5 mr-8">
                    <p className="text-base font-semibold text-gray-800 mb-3">
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
                            <td className="px-4 py-2 whitespace-nowrap">
                              Apr 23
                            </td>
                            <td className="px-4 py-2">$3.1B</td>
                            <td className="px-4 py-2">$195M</td>
                            <td className="px-4 py-2">
                              Altimeter Capital, Dragon Investment Group
                            </td>
                          </tr>
                          <tr className="text-center text-sm">
                            <td className="px-4 py-2">Secondary</td>
                            <td className="px-4 py-2">Apr 23</td>
                            <td className="px-4 py-2">$3.1B</td>
                            <td className="px-4 py-2">$195M</td>
                            <td className="px-4 py-2">
                              Altimeter Capital, Dragon Investment Group
                            </td>
                          </tr>
                          <tr className="text-center text-sm">
                            <td className="px-4 py-2">Secondary</td>
                            <td className="px-4 py-2">Apr 23</td>
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
                    <p className="text-base font-semibold text-gray-800 mb-3">
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
                            <td className="px-4 py-2">Apr 23</td>
                            <td className="px-4 py-2">$3.1B</td>
                            <td className="px-4 py-2">Goodwater Capital</td>
                          </tr>
                          <tr className="text-center text-sm">
                            <td className="px-4 py-2">Scout</td>
                            <td className="px-4 py-2">Apr 23</td>
                            <td className="px-4 py-2">$3.1B</td>
                            <td className="px-4 py-2">Goodwater Capital</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Signals */}
                <div className="flex flex-col mt-6 mx-4">
                  <div className="text-lg font-semibold text-gray-800">
                    Signals
                  </div>
                  <div className="space-x-8 items-align flex mt-4">
                    <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm border border-customGray-50">
                      <HeadCountSignal headCountData={headCountData} />
                    </div>
                    <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm border border-customGray-50">
                      <HeadCountSignal headCountData={headCountData} />
                    </div>
                    <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm border border-customGray-50">
                      <HeadCountSignal headCountData={headCountData} />
                    </div>
                    <div className="w-64 px-6 py-4 rounded-lg drop-shadow-sm border border-customGray-50">
                      <HeadCountSignal headCountData={headCountData} />
                    </div>
                  </div>
                  {/* <HeadCountChart headCountData={headCountData} /> */}
                </div>
              </div>
              {/* Detailed Graphs; TODO: MAKE THIS A SEPARATE COMPONENT */}
              <div className="w-full mt-12">
                <p className="text-2xl font-semibold text-gray-800 ml-2">
                  Detailed Graphs
                </p>
                <hr className="border-t border-customGray-50 mt-2" />
              </div>
            </div>
          </div>
        </ChartDataContext.Provider>
      </SelectedChartContext.Provider>
    </>
  );
}

export default NewDashboard;
