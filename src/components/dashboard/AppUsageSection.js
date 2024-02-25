import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS, COUNTRY_LIST } from "../../constants";
import WebGeoTrafficDoughnut from "../charts/WebGeoTrafficDoughnut";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";
import AppUsageIcon from "/public/assets/AppUsageIcon.svg";
import AppVisitsStackedBarPeers from "../charts/AppVisitsStackedBarPeers";
import AppVisitsCompetitorLineChart from "../charts/AppVisitsCompetitorLineChart";
import AppLoyaltyBreakdownVsPeers from "../charts/AppLoyaltyBreakdownVsPeers";
import AppUsersChart from "../charts/AppUsersChart";
import AppLoyaltyPeersModalCharts from "../charts/AppLoyaltyPeersModalCharts";

function AppUsageSection({
  company,
  country,
  multiCompanyAppData,
  downloadExcel,
  companyCompetitors,
}) {
  return (
    <div className="flex flex-col w-full mt-12 pb-8">
      <div
        id="App Usage"
        className="content-section flex items-end justify-between mt-2 mb-3 rounded-md"
      >
        <div className="flex flex-row items-center">
          <AppUsageIcon className="mx-2 filter invert w-6 h-6" />
          <p className="text-3xl font-semibold text-gray-800 ">App Usage</p>
          <a
            className="group inline-flex items-center hover:cursor-pointer hover:text-primary pl-4"
            onClick={() => downloadExcel("App Usage")}
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
          <span className="mr-2 italic text-sm text-[#C3C3C3]">Powered by</span>
          <Image
            src="/assets/poweredByLogos/data_ai_logo.svg"
            alt="coresignal"
            width="120"
            height="120"
            className="h-6 w-auto"
          />
        </div>
      </div>
      <hr className="border-none h-px bg-customGray-100" />
      <div className="flex flex-col section-indent mt-4">
        <div id="App Growth" className="content-section">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">Growth</p>
          </div>
          {multiCompanyAppData === undefined ||
          Object.keys(multiCompanyAppData).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : !multiCompanyAppData[company] ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No App Users Data Available
              </p>
            </div>
          ) : (
            <AppUsersChart
              appData={multiCompanyAppData[company]}
              country={country}
            ></AppUsersChart>
          )}
        </div>

        <div id="App Growth vs. Peers" className="content-section">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-grxay-800 mr-2">
              Growth vs. Peers
            </p>
          </div>
          {multiCompanyAppData === undefined ||
          Object.keys(multiCompanyAppData).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : !multiCompanyAppData[company] ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No App Growth vs. Peers Data Available
              </p>
            </div>
          ) : (
            <AppVisitsCompetitorLineChart
              multiCompanyAppData={multiCompanyAppData}
              country={country}
            ></AppVisitsCompetitorLineChart>
          )}
        </div>

        <div
          id="App Comparative Market Share vs. Peers"
          className="content-section mt-8"
        >
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Comparative Market Share vs. Peers
            </p>
          </div>
          {companyCompetitors.length === 0 ? (
            <div className="w-full h-80 rounded-lg bg-transparent flex items-center justify-center">
              <p className="text-2xl font-medium text-customGray-150">
                Add Competitors to Compare
              </p>
            </div>
          ) : multiCompanyAppData === undefined ||
            Object.keys(multiCompanyAppData).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : !multiCompanyAppData[company] ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No App Market Share vs. Peers Data Available
              </p>
            </div>
          ) : (
            <AppVisitsStackedBarPeers
              multiCompanyAppData={multiCompanyAppData}
              country={country}
            ></AppVisitsStackedBarPeers>
          )}
        </div>

        <div id="Loyalty vs. Peers" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Loyalty vs. Peers
            </p>
          </div>

          <div className="space-x-8 flex flex-row items-center w-full">
            {multiCompanyAppData === undefined ||
            Object.keys(multiCompanyAppData).length === 0 ? (
              <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
            ) : !multiCompanyAppData[company] ? (
              <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
                <p className="text-sm text-customGray-200">
                  No App Loyalty vs. Peers Data Available
                </p>
              </div>
            ) : (
              <>
                {country === "WW" || country === "ROW" ? (
                  <div className="w-96 h-60 rounded-lg bg-customGray-50 flex items-center justify-center">
                    <p className="text-sm text-customGray-200 px-10 text-center">
                      Metric for '{COUNTRY_LIST[country]}' is not available.
                      Select a specific geography to view.
                    </p>
                  </div>
                ) : (
                  <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                    <AppLoyaltyBreakdownVsPeers
                      multiCompanyAppData={multiCompanyAppData}
                      country={country}
                      selectedChart={CHARTS.appLTMRetention}
                    ></AppLoyaltyBreakdownVsPeers>
                  </div>
                )}
                <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                  <AppLoyaltyBreakdownVsPeers
                    multiCompanyAppData={multiCompanyAppData}
                    country={country}
                    selectedChart={CHARTS.appLTMActiveDays}
                  ></AppLoyaltyBreakdownVsPeers>
                </div>
                <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                  <AppLoyaltyBreakdownVsPeers
                    multiCompanyAppData={multiCompanyAppData}
                    country={country}
                    selectedChart={CHARTS.appLTMTimePerUser}
                  ></AppLoyaltyBreakdownVsPeers>
                </div>
                <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                  <AppLoyaltyBreakdownVsPeers
                    multiCompanyAppData={multiCompanyAppData}
                    country={country}
                    selectedChart={CHARTS.appLTMTimePerSession}
                  ></AppLoyaltyBreakdownVsPeers>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppUsageSection;
