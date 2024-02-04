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
import { CompanyDirectory } from "../components/dashboard/CompanyListDirectory";
import { companyList } from "../components/dashboard/CompanyList";
import HeadcountIcon from "/public/assets/HeadcountIcon.svg";

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function NewDashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const companyDirectory = new CompanyDirectory(companyList);
  const [company, setCompany] = useState("zillow");
  const [country, setCountry] = useState("US");
  const [companyCompetitors, setCompanyCompetitors] = useState([]);
  console.log(companyCompetitors);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();

  const companyDic = companyDirectory.findCompanyByName(company);
  // State to track active sections
  const [activeSections, setActiveSections] = useState({ Overview: true });
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

  useEffect(() => {
    if (company === "stockx") {
      setCompanyCompetitors(
        ["goat", "grailed"].map((name) =>
          companyDirectory.findCompanyByName(name)
        )
      );
    } else {
      setCompanyCompetitors([]);
    }
  }, [company]);

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

  // // API Data
  // const { data: headCountData, error: headCountError } = useSWR(
  //   user && company ? [`/api/private/getHeadCount`, user.id, company] : null,
  //   getHeadCount,
  //   { revalidateOnFocus: false }
  // );

  // const { data: webTrafficData, error: webTrafficError } = useSWR(
  //   user && company && country
  //     ? [`/api/private/getWebTrafficData`, user.id, company + ".com", country]
  //     : null,

  //   getTrafficData,
  //   { revalidateOnFocus: false }
  // );

  // const { data: webTrafficGeoData, error: webTrafficGeoError } = useSWR(
  //   user && company
  //     ? [
  //         `/api/private/getWebTrafficGeoData`,
  //         user.id,
  //         company + ".com",
  //         RELEVANT_CONTINENTS,
  //       ]
  //     : null,
  //   getGeoTrafficData,
  //   { revalidateOnFocus: false }
  // );

  // const { data: crunchbaseData, error: crunchbaseError } = useSWR(
  //   user && company
  //     ? [`/api/private/getCrunchbaseData`, user.id, company]
  //     : null,
  //   getCrunchbaseData,
  //   { revalidateOnFocus: false }
  // );

  // const { data: companyDescription, error: companyDescriptionError } = useSWR(
  //   user && company && crunchbaseData
  //     ? [`/api/private/getCompanyDescription`, company, crunchbaseData]
  //     : null,
  //   ([url, company, crunchbaseData]) => {
  //     return getCompanyDescription([
  //       url,
  //       user.id,
  //       company,
  //       crunchbaseData["fields"]["description"],
  //     ]);
  //   },
  //   { revalidateOnFocus: false }
  // );

  function getApiData(company) {
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
    return {
      headCountData,
      headCountError,
      webTrafficData,
      webTrafficError,
      webTrafficGeoData,
      webTrafficGeoError,
      crunchbaseData,
      crunchbaseError,
      companyDescription,
      companyDescriptionError,
    };
  }
  const {
    headCountData,
    headCountError,
    webTrafficData,
    webTrafficError,
    webTrafficGeoData,
    webTrafficGeoError,
    crunchbaseData,
    crunchbaseError,
    companyDescription,
    companyDescriptionError,
  } = getApiData(company);
  console.log({
    headCountData,
    webTrafficData,
    webTrafficGeoData,
    crunchbaseData,
    companyDescription,
  });
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
          {/* Main Content */}
          <div
            id="main-content"
            className="flex flex-col w-screen overflow-x-hidden items-center px-10 bg-white bg-repeat bg-center"
            style={{
              backgroundImage: "url('/assets/backgroundPatternLight.svg')",
            }}
          >
            {/* Search Bar */}
            <div className="w-[36rem] mt-4">
              <SearchBar company={company} setCompany={setCompany} />
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
                  {companyDirectory.findCompanyByName(company)?.displayedName ||
                    company}
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
                <div className="group flex flex-row items-center ml-4 hover:cursor-pointer hover:text-primary">
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
            {/* Overview Section */}
            <div id="Company Overview" className="content-section w-full mb-20">
              <OverviewSection
                companyAbout={companyDescription}
                crunchbaseData={crunchbaseData}
                headCountData={headCountData}
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
              <div className="flex items-center mt-2 mb-3 rounded-md">
                <HeadcountIcon className="mx-2 filter invert w-6 h-6" />
                <p className="text-3xl font-semibold text-gray-800 ">
                  Headcount
                </p>
              </div>
              <hr className="border-none h-px bg-customGray-200" />
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
            <div className="w-full mt-12">
              <AppUsageSection />
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
        </div>
      </ChartDataContext.Provider>
    </SelectedChartContext.Provider>
  );
}

export default NewDashboard;
