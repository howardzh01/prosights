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
import { getApiData, getExcelDownload } from "../api";
import { createContext } from "react";
import ChartModal from "../components/ChartModal";
import HeadCountChart from "../components/charts/HeadCountChart";
import { CHARTS } from "../constants";
import CompetitorContainer from "../components/dashboard/CompetitorContainer";
import { Skeleton } from "@nextui-org/react";
import { CompanyDirectory } from "../components/dashboard/CompanyListDirectory";
import { companyList } from "../components/dashboard/CompanyList";
import HeadcountIcon from "/public/assets/HeadcountIcon.svg";
import CountrySelector from "../components/dashboard/CountrySelector";
import DashboardNavbar from "../components/dashboard/DashboardNavBar"; // Adjust the import path as necessary
import {
  convertHeadCountChartDataToExcelFormat,
  convertTotalVisitsChartDataToExcelFormat,
  convertWebUsersChartDataToExcelFormat,
  convertBreakdownChartDataToExcelFormat,
  convertTrafficByChannelChartDataToExcelFormat,
  convertTrafficGrowthVsPeersChartDataToExcelFormat,
  convertTrafficMarketShareVsPeersDataToExcelFormat,
  convertTrafficBreakdownVsPeersDataToExcelFormat,
  convertAppUsersChartDataToExcelFormat,
  convertAppUsageGrowthVsPeersChartDataToExcelFormat,
  convertAppUsageMarketShareVsPeersDataToExcelFormat,
  convertAppUsageLoyalUsersVsPeersDataToExcelFormat,
} from "../utils/ChartUtils";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function Dashboard({ enableCrunchbase = true, enableOnlyWebTraffic }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const companyDirectory = new CompanyDirectory(companyList);
  const [companyDic, setCompanyDic] = useState(
    companyDirectory.findCompanyByName("stockx")
  );
  const [country, setCountry] = useState("US");
  const [companyCompetitors, setCompanyCompetitors] = useState([]); // Array of company names

  const [dataLoading, setDataLoading] = useState(true);

  const dataCutoffDate = new Date("2019");

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();
  // const companyDic = companyDirectory.findCompanyByName(company);
  // State to track active sections
  const [activeSections, setActiveSections] = useState({});
  const [apiCalls, setApiCalls] = useState(null); // Initialize apiCalls state

  // Sections for sidebar; MUST have same title as section id, which might be used in child components
  const sections = [
    {
      title: "Company Overview",
      id: "Company Overview",
      parentId: "",
      level: 1,
    },
    {
      title: "Competitor Overview",
      id: "Competitor Overview",
      parentId: "",
      level: 1,
    },
    {
      title: "Headcount",
      id: "Headcount",
      parentId: "",
      level: 1,
    },
    {
      title: "Website Traffic",
      id: "Website Traffic",
      parentId: "",
      level: 1,
    },
    {
      title: "Growth",
      id: "Growth",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "Breakdown",
      id: "Breakdown",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "Quality Over Time",
      id: "Quality Over Time",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "Growth vs. Peers",
      id: "Traffic Growth vs. Peers",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "Market Share vs. Peers",
      id: "Traffic Market Share vs. Peers",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "Breakdown vs. Peers",
      id: "Traffic Breakdown vs. Peers",
      parentId: "Website Traffic",
      level: 2,
    },
    {
      title: "App Usage",
      id: "App Usage",
      parentId: "",
      level: 1,
    },
    {
      title: "Growth",
      id: "App Growth",
      parentId: "App Usage",
      level: 2,
    },
    {
      title: "Growth vs. Peers",
      id: "App Growth vs. Peers",
      parentId: "App Usage",
      level: 2,
    },
    {
      title: "Market Share vs. Peers",
      id: "App Market Share vs. Peers",
      parentId: "App Usage",
      level: 2,
    },
    {
      title: "Loyalty vs. Peers",
      id: "Loyalty vs. Peers",
      parentId: "App Usage",
      level: 2,
    },
    {
      title: "Consumer Spend",
      id: "Consumer Spend",
      parentId: "",
      level: 1,
    },
    {
      title: "Customer Loyalty vs. Peers",
      id: "Customer Loyalty vs. Peers",
      parentId: "Consumer Spend",
      level: 2,
    },
    {
      title: "Growth vs. Peers",
      id: "Consumer Growth vs. Peers",
      parentId: "Consumer Spend",
      level: 2,
    },
    {
      title: "Market Share vs. Peers",
      id: "Consumer Market Share vs. Peers",
      parentId: "Consumer Spend",
      level: 2,
    },
    {
      title: "Ad Spend",
      id: "Ad Spend",
      parentId: "",
      level: 1,
    },
    {
      title: "Market Spend",
      id: "Market Spend",
      parentId: "Ad Spend",
      level: 2,
    },
    {
      title: "Channel Breakdown",
      id: "Channel Breakdown",
      parentId: "Ad Spend",
      level: 2,
    },
    {
      title: "Breakdown vs. Peers",
      id: "Ad Breakdown vs. Peers",
      parentId: "Ad Spend",
      level: 2,
    },
  ];

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
    sections,
    activeSections
  );
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
    if (companyDic && companyDic.name === "stockx") {
      setCompanyCompetitors(
        ["goat", "grailed"].map((name) =>
          companyDirectory.findCompanyByName(name)
        )
      );
    } else {
      setCompanyCompetitors([]);
    }
  }, [companyDic]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedCompanies = [companyDic, ...companyCompetitors];

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

  function downloadExcel(name, devMode = false) {
    // Excel sheet builder
    const headcountSectionBuilder =
      headCountData && headCountData?.[companyDic.displayedName]
        ? [
            {
              type: "bar",
              sheetName: "Headcount",
              req: convertHeadCountChartDataToExcelFormat(
                headCountData[companyDic.displayedName],
                dataCutoffDate
              ),
            },
          ]
        : [];
    const webTrafficSectionBuilder = [
      webTrafficData?.[companyDic.displayedName] !== undefined &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length != 0
        ? {
            type: "bar",
            sheetName: "Traffic Total Visits",
            req: convertTotalVisitsChartDataToExcelFormat(
              webTrafficData[companyDic.displayedName],
              dataCutoffDate
            ),
          }
        : null,
      webTrafficData?.[companyDic.displayedName] !== undefined &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length != 0
        ? {
            type: "bar",
            sheetName: "Traffic Web Users",
            req: convertWebUsersChartDataToExcelFormat(
              webTrafficData[companyDic.displayedName],
              dataCutoffDate
            ),
          }
        : null,
      // TODO: Need to split cases on geo and non-geo data
      webTrafficGeoData?.[companyDic.displayedName] !== undefined &&
      webTrafficGeoData?.[companyDic.displayedName] !== null &&
      Object.keys(webTrafficGeoData?.[companyDic.displayedName]).length !== 0 &&
      webTrafficData?.[companyDic.displayedName] !== undefined &&
      webTrafficData?.[companyDic.displayedName] !== null &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
        ? {
            type: "doughnut",
            sheetName: "Traffic Breakdown",
            req: convertBreakdownChartDataToExcelFormat(
              webTrafficGeoData[companyDic.displayedName],
              webTrafficData[companyDic.displayedName]
            ),
          }
        : null,
      webTrafficData?.[companyDic.displayedName] !== undefined &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
        ? {
            type: "stacked",
            sheetName: "Traffic Total Visits by Channel",
            req: convertTrafficByChannelChartDataToExcelFormat(
              webTrafficData[companyDic.displayedName],
              dataCutoffDate
            ),
          }
        : null,
      webTrafficData !== undefined &&
      Object.keys(webTrafficData).length != 0 &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
        ? {
            type: "line",
            sheetName: "Traffic Growth vs. Peers",
            req: convertTrafficGrowthVsPeersChartDataToExcelFormat(
              webTrafficData,
              dataCutoffDate
            ),
          }
        : null,
      webTrafficData !== undefined &&
      Object.keys(webTrafficData).length != 0 &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0
        ? {
            type: "stacked",
            sheetName: "Traffic Market Share vs. Peers",
            req: convertTrafficMarketShareVsPeersDataToExcelFormat(
              webTrafficData,
              dataCutoffDate
            ),
          }
        : null,
      // TODO: Need to split cases on geo and non-geo data
      webTrafficData !== undefined &&
      Object.keys(webTrafficData).length != 0 &&
      Object.keys(webTrafficData?.[companyDic.displayedName]).length !== 0 &&
      webTrafficGeoData !== undefined &&
      Object.keys(webTrafficGeoData).length != 0 &&
      Object.keys(webTrafficGeoData?.[companyDic.displayedName]).length !== 0
        ? {
            type: "stacked",
            sheetName: "Traffic Breakdown vs. Peers",
            req: convertTrafficBreakdownVsPeersDataToExcelFormat(
              webTrafficGeoData,
              webTrafficData
            ),
          }
        : null,
    ].filter(Boolean);
    const appUsageSectionBuilder = [];
    if (
      dataAIData &&
      (dataAIData[companyDic?.displayedName] || dataAIData[companyDic?.name]) &&
      Object.keys(dataAIData).length !== 0
    ) {
      appUsageSectionBuilder.push({
        type: "bar",
        sheetName: "App Users",
        req: convertAppUsersChartDataToExcelFormat(
          dataAIData[companyDic?.displayedName || companyDic?.name][
            "app_performance"
          ],
          dataCutoffDate
        ),
      });
      appUsageSectionBuilder.push(
        {
          type: "line",
          sheetName: "App Growth vs. Peers",
          req: convertAppUsageGrowthVsPeersChartDataToExcelFormat(
            dataAIData,
            dataCutoffDate
          ),
        },
        {
          type: "stacked",
          sheetName: "App Market Share vs. Peers",
          req: convertAppUsageMarketShareVsPeersDataToExcelFormat(
            dataAIData,
            dataCutoffDate
          ),
        },
        {
          type: "bar",
          sheetName: "App Loyalty vs. Peers",
          req: convertAppUsageLoyalUsersVsPeersDataToExcelFormat(dataAIData),
        }
      );
    }
    const dividerBuilder = (name) => ({
      type: "divider",
      sheetName: name,
      req: {},
    });

    switch (name) {
      case "Headcount":
        getExcelDownload(headcountSectionBuilder, devMode);
        break;
      case "Web Traffic":
        getExcelDownload(webTrafficSectionBuilder, devMode);
        break;
      case "App Usage":
        getExcelDownload(appUsageSectionBuilder, devMode);
        break;
      default:
        // Case of downloading everything
        getExcelDownload(
          [
            dividerBuilder("Headcount >>>"),
            ...headcountSectionBuilder,
            dividerBuilder("Web Traffic >>>"),
            ...webTrafficSectionBuilder,
            dividerBuilder("App Usage >>>"),
            ...appUsageSectionBuilder,
          ],
          devMode
        );
        break;
    }
  }

  const downloadPDF = async () => {
    const { default: html2pdf } = await import("html2pdf.js");

    const element = document.getElementById("main-content");
    const contentWidth = element.scrollWidth; // Get the full scrollable width of the content
    // TODO: Manual 1.5x multiplier to add in extra space to the height; this is a temporary fix.
    // Otherwise, scroll height is too short because of pagebreak avoid all mode
    const contentHeight = element.scrollHeight * 1.5; // Get the full scrollable height of the content

    const opt = {
      margin: [0.5, 0.5],
      filename: "dashboard.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        useCORS: true,
        scale: 2, // Adjust this as needed
        logging: true,
        dpi: 192,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowHeight: contentHeight,
        windowWidth: contentWidth, // Set the canvas width to the full content width
      },
      jsPDF: {
        unit: "pt", // Points can allow for more fine-grained control over the size
        format: [contentWidth, 792], // Custom format size [width, height] in points (72 points per inch)
        orientation: "landscape",
      },
      pagebreak: { mode: "avoid-all" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save() // Save the PDF directly, without opening it in a new window
      .catch((err) => {
        console.error("Error exporting PDF:", err);
      });
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
  } = getApiData(
    user,
    companyDic ? [companyDic, ...companyCompetitors] : [],
    country,
    enableCrunchbase
  );
  // console.log("Web Traffic", webTrafficData);
  // console.log("DAATA AI", dataAIData);

  // const competitorData = getApiData(user, competitor.name, country);

  // console.log(competitorData);
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
        <div className="flex flex-row">
          {/* Sidebar */}
          <div className="flex-shrink-0 sticky top-0 w-60 h-screen">
            <SideBar
              sections={sections}
              activeSections={activeSections}
              apiUsage={apiCalls}
            />
          </div>
          {companyDic && companyDic.name ? (
            // Main Content
            <div
              id="main-content"
              className="h-screen flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
              style={{
                backgroundImage: "url('/assets/backgroundPatternLight.svg')",
              }}
            >
              {/* Company name, country, and comparing section */}
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
              />
              {/* Overview Section */}
              <div
                id="Company Overview"
                className="content-section w-full mb-20"
              >
                <OverviewSection
                  companyAbout={
                    companyDescriptionPull?.[companyDic.displayedName]
                  }
                  crunchbaseData={
                    crunchbaseDataPull?.[companyDic.displayedName]
                  } // {companyName: null} if no data
                  headCountData={headCountData?.[companyDic.displayedName]}
                  webTrafficData={webTrafficData?.[companyDic.displayedName]}
                  appData={dataAIData?.[companyDic.displayedName]}
                  country={country}
                />
              </div>
              {/* Competitor Overview */}
              <div id="Competitor Overview" className="content-section w-full">
                <CompetitorOverviewSection
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
                      headCountData={headCountData?.[companyDic.displayedName]}
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
                />
              </div>
              {/* App Usage */}
              <div className="w-full mt-12">
                <AppUsageSection
                  company={companyDic?.displayedName || companyDic?.name}
                  country={country}
                  multiCompanyAppData={dataAIData}
                  downloadExcel={downloadExcel}
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
          ) : (
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
          )}
        </div>
      </ChartDataContext.Provider>
    </SelectedChartContext.Provider>
  );
}

export default Dashboard;
