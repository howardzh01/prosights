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
import { CHARTS } from "../constants";
import CompetitorContainer from "../components/dashboard/CompetitorContainer";
import { Skeleton } from "@nextui-org/react";
import { CompanyDirectory } from "../components/dashboard/CompanyListDirectory";
import { companyList } from "../components/dashboard/CompanyList";
import HeadcountIcon from "/public/assets/HeadcountIcon.svg";
import CountrySelector from "../components/dashboard/CountrySelector";
import { aggregateData } from "../utils/Utils";
import { convertToChartData } from "../utils/BackendUtils";

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
  const todaysDate = new Date()
    .toLocaleDateString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    .replaceAll("-", ".");

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
  // useEffect(() => {
  //   setWebsiteTrafficData(null);
  //   setAppUsageData(null);
  // }, [country]);
  async function downloadExcel() {
    try {
      const timeFrames = ["month", "quarterYear", "year"];
      const chartData = Object.fromEntries(
        timeFrames.map((timeFrame) => [
          `${timeFrame}ChartData`,
          convertToChartData(
            aggregateData(
              headCountData?.[companyDic.displayedName],
              "headcount",
              "last",
              timeFrame
            ),
            dataCutoffDate
          ),
        ])
      );
      const { monthChartData, quarterYearChartData, yearChartData } = chartData;

      const columnTitles = [
        "Date",
        ...monthChartData.tableData.tableDatasets.map(
          (dataset) => dataset.label
        ),
      ];
      const datasets = Object.values(chartData).map((data) => {
        return columnTitles.reduce((acc, title, index) => {
          if (index === 0) {
            acc[title] = data.chartData.labels;
          } else {
            acc[title] = data.tableData.tableDatasets[index - 1].data;
          }
          return acc;
        }, {});
      });

      const response = await fetch(
        "https://kev2010--generate-excel-generate-excel-dev.modal.run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ columnTitles, datasets }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "excel-file.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  }

  const downloadPDF = async () => {
    const { default: html2pdf } = await import("html2pdf.js");

    const element = document.getElementById("main-content");
    const contentWidth = element.scrollWidth; // Get the full scrollable width of the content

    const opt = {
      margin: [0.5, 0.5],
      filename: "dashboard.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // Adjust this as needed
        logging: true,
        dpi: 192,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
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
        />
        <div className="flex flex-row">
          {/* Sidebar */}
          <div className="flex-shrink-0 sticky top-0 w-60 h-screen">
            <SideBar sections={sections} activeSections={activeSections} />
          </div>
          {companyDic && companyDic.name ? (
            // Main Content
            <div
              id="main-content"
              className="flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
              style={{
                backgroundImage: "url('/assets/backgroundPatternLight.svg')",
              }}
            >
              {/* Search Bar */}
              <div
                id="Company Overview"
                className="content-section w-[36rem] pt-4"
              >
                <SearchBar
                  setCompany={setCompanyDic}
                  setCompanyCompetitors={setCompanyCompetitors}
                />
              </div>
              {/* Company name, country, and comparing section */}
              <div className="mt-6 flex flex-row justify-between w-full items-center">
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
                  {/* {console.log(crunchbaseDataPull)} */}
                  <p className="text-3xl font-bold text-gray-800 pl-1">
                    {companyDic.displayedName}
                  </p>
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
                    onClick={downloadExcel}
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
              <hr className="border-none h-px bg-customGray-100 w-full mt-2" />
              {/* Overview Section */}
              <div className="content-section w-full mb-20">
                <OverviewSection
                  companyAbout={
                    companyDescriptionPull?.[companyDic.displayedName]
                  }
                  crunchbaseData={
                    crunchbaseDataPull?.[companyDic.displayedName]
                  } // {companyName: null} if no data
                  headCountData={headCountData?.[companyDic.displayedName]}
                />
              </div>
              {/* Competitor Overview */}
              <div id="Competitor Overview" className="content-section w-full">
                <CompetitorOverviewSection />
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
                    <a
                      className="group inline-flex items-center hover:cursor-pointer hover:text-primary"
                      href="/assets/excelFiles/StockX_Headcount_2024.02.04.xlsx"
                      download={`StockX_Headcount_${todaysDate}.xlsx`}
                    >
                      <Image
                        src="/assets/downloadInactive.svg"
                        className="w-5 h-5 opacity-50 object-contain group-hover:hidden"
                        width={256}
                        height={256}
                      />
                      <Image
                        src="/assets/downloadActive.svg"
                        className="w-5 h-5 object-contain hidden group-hover:block"
                        width={256}
                        height={256}
                      />
                    </a>
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
                  webTrafficDic={webTrafficData}
                  webTrafficGeoDic={webTrafficGeoData}
                />
              </div>
              {/* App Usage */}
              <div className="w-full mt-12">
                <AppUsageSection
                  company={companyDic?.displayedName || companyDic?.name}
                  multiCompanyAppData={dataAIData}
                />
              </div>
              {/* Consumer Spend */}
              <div className="w-full mt-16">
                <ConsumerSpendSection />
              </div>
              {/* Ad Spend */}
              <div className="w-full">
                <AdSpendSection />
              </div>
            </div>
          ) : (
            <div
              id="main-content"
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
