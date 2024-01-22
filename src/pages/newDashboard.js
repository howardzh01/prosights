import React, { useEffect, useState } from "react";
import NewSideBar from "../components/dashboard/NewSideBar";
import SearchBar from "../components/dashboard/SearchBar";
import OverviewSection from "../components/dashboard/OverviewSection";
import WebsiteTrafficSection from "../components/dashboard/WebsiteTrafficSection";
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
import { createContext } from "react";
import ChartModal from "../components/ChartModal";
import HeadCountChart from "../components/charts/HeadCountChart";
import { CHARTS } from "../constants";

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

  // State to track active sections
  const [activeSections, setActiveSections] = useState({});
  // Sections for sidebar; MUST have same title as section id, which might be passed in as a prop
  const sections = [
    {
      title: "Overview",
      level: 1,
    },
    {
      title: "Headcount",
      level: 1,
    },
    {
      title: "Website Traffic",
      level: 1,
    },
    {
      title: "Visits Breakdown",
      level: 2,
    },
    {
      title: "Traffic Momentum",
      level: 2,
    },
    {
      title: "Traffic Quality",
      level: 2,
    },
    {
      title: "Consumer Spend",
      level: 2,
    },
    {
      title: "Ad Spend",
      level: 2,
    },
    {
      title: "Market Share",
      level: 2,
    },
  ];

  useEffect(() => {
    let observer;
    // let initialCheckDone = false;

    const observerCallback = (entries, observer) => {
      //   if (!initialCheckDone) {
      //     // Delay setting the active section until after the initial call
      //     setTimeout(() => (initialCheckDone = true), 100);
      //     return;
      //   }

      entries.forEach((entry) => {
        setActiveSections((prevActiveSections) => {
          const newActiveSections = { ...prevActiveSections };
          const targetId = entry.target.id;

          if (entry.isIntersecting) {
            newActiveSections[targetId] = true;
          } else {
            delete newActiveSections[targetId];
          }
          return newActiveSections;
        });
      });
    };

    const options = {
      root: null,
      threshold: 0.5,
    };

    observer = new IntersectionObserver(observerCallback, options);

    const sections = document.querySelectorAll(".content-section");
    sections.forEach((section) => observer.observe(section));

    // Disconnect the observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

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
    <SelectedChartContext.Provider value={{ selectedChart, setSelectedChart }}>
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
          <div className="flex-shrink-0 sticky top-0 w-60 h-screen">
            <NewSideBar sections={sections} activeSections={activeSections} />
          </div>
          {/* Main Content */}
          <div
            className="flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
            style={{
              backgroundImage: "url('/assets/backgroundPatternUltraLight.svg')",
            }}
          >
            {/* Search Bar */}
            <div className="w-[36rem] mt-2">
              <SearchBar setCompany={setCompany} />
            </div>
            {/* Company name, country, and comparing section */}
            <div className="mt-6 flex flex-row justify-between w-full items-center">
              <div className="flex flex-row items-center">
                <Image
                  src={companyLogo}
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
            {/* Overview Section */}
            <div id="Overview" className="content-section w-full">
              <OverviewSection
                companyAbout={companyAbout}
                companyBusinessModel={companyBusinessModel}
                companyFoundedYear={companyFoundedYear}
                companyHeadcount={companyHeadcount}
                companyHeadquarters={companyHeadquarters}
                companyValuation={companyValuation}
                companyLastRoundSize={companyLastRoundSize}
                companyLastDealType={companyLastDealType}
                headCountData={headCountData}
              />
            </div>
            {/* Headcount; TODO: MAKE THIS A SEPARATE COMPONENT */}
            <div
              id="Headcount"
              className="flex flex-col w-full mt-12 content-section"
            >
              <p className="text-2xl font-semibold text-gray-800 ml-2">
                Headcount
              </p>
              <hr className="border-t border-customGray-50 mt-2 mb-4" />
              <div className="mx-4">
                <HeadCountChart headCountData={headCountData} />
              </div>
            </div>
            {/* Website Traffic */}
            <div className="w-full">
              <WebsiteTrafficSection
                webTrafficData={webTrafficData}
                webTrafficGeoData={webTrafficGeoData}
              />
            </div>
          </div>
        </div>
      </ChartDataContext.Provider>
    </SelectedChartContext.Provider>
  );
}

export default NewDashboard;
