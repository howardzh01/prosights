import React, { useEffect, useState } from "react";
import SideBar from "../components/dashboard/SideBar";
import SearchBar from "../components/dashboard/SearchBar";
import OverviewSection from "../components/dashboard/OverviewSection";
import WebsiteTrafficSection from "../components/dashboard/WebsiteTrafficSection";
import AppUsageSection from "../components/dashboard/AppUsageSection";
import ConsumerSpendSection from "../components/dashboard/ConsumerSpendSection";
import AdSpendSection from "../components/dashboard/AdSpendSection";
import CompetitorOverviewSection from "../components/dashboard/CompetitorOverviewSection";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { getApiData } from "../api";
import { createContext } from "react";
import ChartModal from "../components/ChartModal";
import HeadCountChart from "../components/charts/HeadCountChart";
import { CHARTS, CONSTANTS, SECTIONS } from "../constants";
import CompetitorContainer from "../components/dashboard/CompetitorContainer";
import { Skeleton } from "@nextui-org/react";
import { CompanyDirectory } from "../components/dashboard/CompanyListDirectory";
import { companyListFixed } from "../components/dashboard/CompanyList";
import HeadcountIcon from "/public/assets/HeadcountIcon.svg";
import CountrySelector from "../components/dashboard/CountrySelector";
import DashboardNavbar from "../components/dashboard/DashboardNavBar";
import EmptyState from "../components/dashboard/EmptyState";
import APILimitReached from "../components/dashboard/APILimitReached";
import {
  downloadPDF,
  downloadExcelBuilder,
} from "../utils/FrontendDownloadUtils";
import { fetchCompanyList } from "../utils/BackendUtils";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

// export async function getStaticProps(context) {
//   const companyListRaw = await fetchCompanyList(CONSTANTS.MAPPINGS_CSV_URL);
//   const companyList = companyListRaw.map((company) =>
//     Object.fromEntries(
//       Object.entries(company).filter(([key]) =>
//         ["displayedName", "appId", "url"].includes(key)
//       )
//     )
//   );
//   return {
//     props: { initCompanyList: companyList }, // will be passed to the page component as props
//   };
// }

function Dashboard({
  enableCrunchbase = false,
  enableOnlyWebTraffic,
  initCompanyList = [],
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [companyList, setCompanyList] = useState(initCompanyList);

  const companyDirectory = new CompanyDirectory(companyList);
  const [companyDic, setCompanyDic] = useState(
    companyDirectory.findCompanyByUrl("tcs.com")
  );
  const [country, setCountry] = useState("US");
  const [companyCompetitors, setCompanyCompetitors] = useState([]); // Array of company names

  const [dataLoading, setDataLoading] = useState(true);

  const dataCutoffDate = new Date("2019");

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();
  // State to track active sections
  const [activeSections, setActiveSections] = useState({});
  const [apiCalls, setApiCalls] = useState(null); // Initialize apiCalls state

  const [showPopup, setShowPopup] = useState(false);

  function getActiveLevel1SectionName(sections, activeSections) {
    if (Object.keys(activeSections).length === 0) return "Company Overview"; // Loading state
    let activeSectionOrParentName = "No active section";

    const activeSection = sections.find(
      (section) => activeSections[section.id]
    );

    if (activeSection) {
      if (activeSection.level === 1) {
        activeSectionOrParentName = activeSection.title;
      } else {
        const parentSection = sections.find(
          (parent) => parent.id === activeSection.parentId
        );
        activeSectionOrParentName = parentSection
          ? parentSection.title
          : "No active parent section";
      }
    }

    return activeSectionOrParentName;
  }
  const activeLevel1SectionName = getActiveLevel1SectionName(
    SECTIONS,
    activeSections
  );

  const [navbarCalculatedHeight, setNavbarCalculatedHeight] = useState(0);

  const todaysDate = new Date()
    .toLocaleDateString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    .replaceAll("-", ".");
  // useEffect(() => {
  //   // Scroll to the "Loyalty vs. Peers" section on page load
  //   const section = document.getElementById("Loyalty vs. Peers");
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, []); // The empty array ensures this effect runs only once after initial render

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        console.log("Fetching company list");
        const response = await fetch("/api/private/getMappingData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ csvUrl: CONSTANTS.MAPPINGS_CSV_URL }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch company list");
        }
        const data = await response.json();
        console.log("Fetched company list:", data);
        setCompanyList(data);
      } catch (error) {
        console.error("Error fetching company list:", error);
      }
    };

    fetchCompanyList();
  }, []);

  useEffect(() => {
    if (!dataLoading && companyDic) {
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
  }, [dataLoading, companyDic]);

  useEffect(() => {
    if (dataLoading) {
      // This is an inelegant way to fix the issue of sidebar sections all being highlighted on page load
      // Approximately the time it takes for the page to load; cleaner fix would be to update when the data is loaded
      setTimeout(() => {
        setDataLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const competitorsMap = {
      "stockx.com": ["grailed.com"],
      "tcs.com": ["amazon.com"],
      stockx: ["goat", "grailed"],
      goat: ["stockx", "grailed"],
      grailed: ["stockx", "goat"],
      tinder: ["bumble"],
      bumble: ["tinder"],
    };
    const competitors = competitorsMap?.[companyDic?.url];
    if (competitors) {
      setCompanyCompetitors(
        competitors.map((url) => companyDirectory.findCompanyByUrl(url))
      );
    } else {
      setCompanyCompetitors([]);
    }
  }, [companyDic]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const combinedCompanies = [companyDic, ...companyCompetitors].filter(
          (company) => company != null
        );
        const response = await fetch("/api/private/postApiUsage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id, // Include the userId in the request body
            companyNameList: combinedCompanies.map((company) =>
              company.name.toLowerCase()
            ), // Include the companyNameList
            country: country, // Include the country
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setApiCalls(data.apiUsage); // Update the apiCalls state with the response data
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchData();
  }, [companyDic, companyCompetitors, country, user]);

  // useEffect(() => {
  //   setWebsiteTrafficData(null);
  //   setAppUsageData(null);
  // }, [country]);

  const downloadExcel = (name) => {
    downloadExcelBuilder(
      headCountData,
      webTrafficData,
      webTrafficGeoData,
      dataAIData,
      companyDic,
      dataCutoffDate,
      country,
      name,
      false
    );
  };

  const {
    headCountData,
    headCountError,
    webTrafficData,
    webTrafficError,
    webTrafficGeoData,
    webTrafficGeoError,
    crunchbaseDataPull,
    crunchbaseErrorPull,
    companyDescriptionPull,
    companyDescriptionErrorPull,
    dataAIData,
    dataAIError,
    fullCompanyInfo,
    fullCompanyInfoError,
  } = getApiData(
    user,
    companyDic ? [companyDic, ...companyCompetitors] : [],
    country,
    enableCrunchbase
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
          country={country}
        />
        <div className="relative flex flex-row bg-customGray-900">
          {/* Sidebar */}
          <div className="flex-shrink-0 w-60 h-screen z-0">
            <SideBar
              sections={SECTIONS}
              activeSections={activeSections}
              apiUsage={apiCalls}
              navbarCalculatedHeight={navbarCalculatedHeight}
            />
          </div>
          <div className="flex flex-col relative h-screen w-full overflow-x-hidden bg-transparent z-40">
            {companyDic && companyDic.name && (
              <div className="sticky top-0 z-40 bg-transparent h-14 flex items-center justify-between">
                <div className="flex items-center px-8 py-2 border-2 border-[#373B46] rounded-lg opacity-0 cursor-default ml-2">
                  <p className="text-sm font-semibold text-customGray-200">
                    Wrong or missing company data?
                  </p>
                </div>
                <div className="w-[30rem] 2xl:w-[34rem] mx-auto">
                  <SearchBar
                    companyDirectory={companyDirectory}
                    setCompany={setCompanyDic}
                    setCompanyCompetitors={setCompanyCompetitors}
                    darkMode={true}
                  />
                </div>
                <div className="group flex items-center px-6 py-2 border-2 border-[#373B46] rounded-lg mr-2 cursor-pointer hover:border-primary">
                  <p className="text-sm font-medium text-customGray-200 group-hover:text-primaryMedium">
                    Wrong or missing company data?
                  </p>
                </div>
              </div>
            )}
            {apiCalls >= CONSTANTS.API_LIMIT ? (
              <APILimitReached />
            ) : companyDic && companyDic.name ? (
              // Main Content
              <div
                className="h-full z-30 relative flex flex-col w-full bg-white bg-repeat bg-center overflow-x-hidden rounded-tl-lg"
                id="main-content"
                style={{
                  backgroundImage: "url('/assets/backgroundPatternLight.svg')",
                }}
              >
                {/* Company name, country, and comparing section */}
                <div className="sticky top-0 px-10 pt-6 z-30 bg-white">
                  <DashboardNavbar
                    companyDic={companyDic}
                    country={country}
                    setCountry={setCountry}
                    downloadPDF={downloadPDF}
                    downloadExcel={downloadExcel}
                    companyDirectory={companyDirectory}
                    setCompanyDic={setCompanyDic}
                    companyCompetitors={companyCompetitors}
                    setCompanyCompetitors={setCompanyCompetitors}
                    crunchbaseDataPull={crunchbaseDataPull}
                    activeLevel1SectionName={activeLevel1SectionName}
                    setNavbarCalculatedHeight={setNavbarCalculatedHeight}
                  />
                </div>
                <div className="h-full px-10 flex flex-col w-full items-center">
                  {/* Overview Section */}
                  <div
                    id="Company Overview"
                    className="content-section w-full mb-20 mt-2"
                  >
                    <OverviewSection
                      companyInfo={fullCompanyInfo?.[companyDic.displayedName]}
                      companyAbout={
                        companyDescriptionPull?.[companyDic.displayedName]
                      }
                      crunchbaseData={
                        crunchbaseDataPull?.[companyDic.displayedName]
                      } // {companyName: null} if no data
                      headCountData={headCountData?.[companyDic.displayedName]}
                      webTrafficData={
                        webTrafficData?.[companyDic.displayedName]
                      }
                      appData={dataAIData?.[companyDic.displayedName]}
                      country={country}
                    />
                  </div>
                  {/* Competitor Overview */}
                  <div
                    id="Competitor Overview"
                    className="content-section w-full"
                  >
                    <CompetitorOverviewSection
                      companyInfo={fullCompanyInfo}
                      companyDic={companyDic}
                      companyDescriptions={companyDescriptionPull}
                      crunchbaseData={crunchbaseDataPull} // {companyName: null} if no data
                      headCountData={headCountData}
                      companyCompetitors={companyCompetitors}
                    />
                  </div>
                  {/* Headcount; TODO: MAKE THIS A SEPARATE COMPONENT */}
                  <div
                    id="Headcount"
                    className="flex flex-col w-full mt-12 content-section mb-12"
                  >
                    <div className="flex items-end justify-between mt-2 mb-3 rounded-md">
                      <div className="flex flex-row items-center">
                        <HeadcountIcon className="mx-2 filter invert w-6 h-6" />
                        <p className="text-3xl font-semibold text-gray-800 ">
                          Headcount
                        </p>
                        <a
                          className="group inline-flex items-center hover:cursor-pointer hover:text-primary pl-4"
                          onClick={() => downloadExcel("Headcount")}
                        >
                          <Image
                            src="/assets/downloadInactive.svg"
                            className="w-6 h-6 opacity-50 object-contain group-hover:hidden"
                            width={256}
                            height={256}
                          />
                          <Image
                            src="/assets/downloadActive.svg"
                            className="w-6 h-6 object-contain hidden group-hover:block"
                            width={256}
                            height={256}
                          />
                        </a>
                      </div>
                      <div className="flex flex-row items-center ml-4">
                        <span className="mr-2 italic text-sm text-[#C3C3C3]">
                          Powered by
                        </span>
                        <Image
                          src="/assets/poweredByLogos/coresignal_logo.svg"
                          alt="coresignal"
                          width="120"
                          height="120"
                          className="h-4 w-auto"
                        />
                      </div>
                    </div>
                    <hr className="border-none h-px bg-customGray-100" />
                    <div className="mt-6 section-indent">
                      <div className="flex flex-row items-center mb-3">
                        <p className="text-lg font-semibold text-gray-800 mr-2">
                          Employees
                        </p>
                      </div>
                      {headCountData &&
                      headCountData?.[companyDic.displayedName] ? (
                        <HeadCountChart
                          headCountData={
                            headCountData?.[companyDic.displayedName]
                          }
                        />
                      ) : headCountData?.[companyDic.displayedName] ===
                        undefined ? (
                        <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
                      ) : (
                        <div className="w-full h-80 rounded-lg bg-customGray-50">
                          <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-sm text-customGray-200">
                              No Headcount Data Available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Website Traffic */}
                  <div className="w-full">
                    <WebsiteTrafficSection
                      company={companyDic?.displayedName || companyDic?.name}
                      country={country}
                      webTrafficDic={webTrafficData}
                      webTrafficGeoDic={webTrafficGeoData}
                      downloadExcel={downloadExcel}
                      companyCompetitors={companyCompetitors}
                    />
                  </div>
                  {/* App Usage */}
                  <div className="w-full mt-12">
                    <AppUsageSection
                      company={companyDic?.displayedName || companyDic?.name}
                      country={country}
                      multiCompanyAppData={dataAIData}
                      downloadExcel={downloadExcel}
                      companyCompetitors={companyCompetitors}
                    />
                  </div>
                  {/* Consumer Spend */}
                  <div className="w-full mt-16">
                    <ConsumerSpendSection country={country} />
                  </div>
                  {/* Ad Spend */}
                  <div className="w-full">
                    <AdSpendSection country={country} />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                companyDirectory={companyDirectory}
                setCompanyDic={setCompanyDic}
                setCompanyCompetitors={setCompanyCompetitors}
              />
            )}
          </div>
        </div>
      </ChartDataContext.Provider>
    </SelectedChartContext.Provider>
  );
}

export default Dashboard;
