import React, { useEffect, useState } from "react";
import NewSideBar from "../components/dashboard/NewSideBar";
import SearchBar from "../components/dashboard/SearchBar";
import OverviewSection from "../components/dashboard/OverviewSection";
import WebsiteTrafficSection from "../components/dashboard/WebsiteTrafficSection";
import AppUsageSection from "../components/dashboard/AppUsageSection";
import ConsumerSpendSection from "../components/dashboard/ConsumerSpendSection";
import AdSpendSection from "../components/dashboard/AdSpendSection";
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
import CompetitorContainer from "../components/dashboard/CompetitorContainer";
import { Skeleton } from "@nextui-org/react";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function NewDashboard() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [company, setCompany] = useState("zillow");
  const [country, setCountry] = useState("US");
  const [companyCompetitors, setCompanyCompetitors] = useState([
    "zillow",
    "redfin",
    "stockx",
  ]);

  const [dataLoading, setDataLoading] = useState(true);

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();

  // State to track active sections
  const [activeSections, setActiveSections] = useState({ Overview: true });
  // Sections for sidebar; MUST have same title as section id, which might be used in child components
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
      title: "Traffic Growth",
      level: 2,
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
      title: "Traffic Growth vs. Peers",
      level: 2,
    },
    {
      title: "Traffic Market Share vs. Peers",
      level: 2,
    },
    {
      title: "Visits Breakdown vs. Peers",
      level: 2,
    },
    {
      title: "App Usage",
      level: 1,
    },
    {
      title: "App Loyalty vs. Peers",
      level: 2,
    },
    {
      title: "App Market Share vs. Peers",
      level: 2,
    },
    {
      title: "App Usage Growth vs. Peers",
      level: 2,
    },
    {
      title: "Consumer Spend",
      level: 1,
    },
    {
      title: "Customer Loyalty",
      level: 2,
    },
    {
      title: "Ad Spend",
      level: 1,
    },
    {
      title: "Ad Spend Channel Breakdown",
      level: 2,
    },
  ];

  useEffect(() => {
    console.log("active", activeSections);
  }, [activeSections]);

  useEffect(() => {
    if (!dataLoading) {
      let observer;

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          const targetId = entry.target.id;

          setActiveSections((prevActiveSections) => {
            const newActiveSections = { ...prevActiveSections };

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
      sections.forEach((section) => {
        observer.observe(section);
      });

      // Disconnect the observer on unmount
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [dataLoading]);

  useEffect(() => {
    if (dataLoading) {
      // This is an inelegant way to fix the issue of sidebar sections all being highlighted on page load
      // Approximately the time it takes for the page to load; cleaner fix would be to update when the data is loaded
      setTimeout(() => {
        setDataLoading(false);
      }, 1000);
    }
  }, []);

  // API Data
  const { data: headCountData, error: headCountError } = useSWR(
    user && company ? [`/api/private/getHeadCount`, user.id, company] : null,
    getHeadCount,
    { revalidateOnFocus: false }
  );

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
    user && company && crunchbaseData
      ? [`/api/private/getCompanyDescription`, company, crunchbaseData]
      : null,
    ([url, company, crunchbaseData]) => {
      return getCompanyDescription([
        url,
        user.id,
        company,
        crunchbaseData["fields"]["description"],
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
                {crunchbaseData?.["fields"]?.["image_url"] ? (
                  <Image
                    src={crunchbaseData["fields"]["image_url"]}
                    className="w-10 h-10 mr-2 object-contain rounded-md"
                    width={256}
                    height={256}
                  />
                ) : (
                  <Skeleton className="w-10 h-10 mr-2 rounded-md bg-customGray-50" />
                )}
                <p className="text-4xl font-bold text-gray-800 pl-1">
                  {company}
                </p>
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
              {/* <div className="flex flex-row items-center">
                <Image
                  src="/assets/compare.svg"
                  alt="Compare"
                  className="w-4 h-4 mr-1 object-contain"
                  width={128}
                  height={128}
                />
                <p className="text-base text-customGray-500">Compare</p>
              </div> */}
              <CompetitorContainer
                companyCompetitors={companyCompetitors}
                setCompanyCompetitors={setCompanyCompetitors}
              ></CompetitorContainer>
            </div>
            {/* Overview Section */}
            <div id="Overview" className="content-section w-full">
              <OverviewSection
                companyAbout={companyDescription}
                crunchbaseData={crunchbaseData}
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
                {headCountData ? (
                  <HeadCountChart headCountData={headCountData} />
                ) : (
                  <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
                )}
              </div>
            </div>
            {/* Website Traffic */}
            <div className="w-full">
              <WebsiteTrafficSection
                webTrafficData={webTrafficData}
                webTrafficGeoData={webTrafficGeoData}
              />
            </div>
            {/* App Usage */}
            <div className="w-full">
              <AppUsageSection />
            </div>
            {/* Consumer Spend */}
            <div className="w-full">
              <ConsumerSpendSection />
            </div>
            {/* Ad Spend */}
            <div className="w-full">
              <AdSpendSection />
            </div>
          </div>
        </div>
      </ChartDataContext.Provider>
    </SelectedChartContext.Provider>
  );
}

export default NewDashboard;
