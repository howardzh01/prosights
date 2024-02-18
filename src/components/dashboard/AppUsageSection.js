import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
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

function AppUsageSection({
  company,
  country,
  multiCompanyAppData,
  downloadExcel,
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
          {multiCompanyAppData === undefined ? (
            <div> </div>
          ) : (
            <AppUsersChart
              appData={multiCompanyAppData[company]}
              country={country}
            ></AppUsersChart>
          )}
        </div>

        <div id="App Growth vs. Peers" className="content-section">
          {multiCompanyAppData === undefined ? (
            <div> </div>
          ) : (
            <AppVisitsCompetitorLineChart
              multiCompanyAppData={multiCompanyAppData}
              country={country}
            ></AppVisitsCompetitorLineChart>
          )}
        </div>

        <div id="App Market Share vs. Peers" className="content-section mt-8">
          {multiCompanyAppData === undefined ? (
            <div> </div>
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
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
              <AppLoyaltyBreakdownVsPeers
                multiCompanyAppData={multiCompanyAppData}
                country={country}
                selectedChart={CHARTS.appLTMRetention}
              ></AppLoyaltyBreakdownVsPeers>
            </div>
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

            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Average User Time Per Month
              </h2>
              <div className="flex flex-row items-center mb-6">
                <Image
                  src="/assets/calendar.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">
                  Last 12 Months
                </p>
                <Image
                  src="/assets/globe.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1 ml-4"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">US</p>
              </div>
              <div className="flex flex-row space-x-4">
                <Image
                  src="/assets/graphPictures/AppPeersTimeSpent.svg"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/AppLegend.svg"
                  className="w-16 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div> */}
            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                D30 Usage Retention
              </h2>
              <div className="flex flex-row items-center mb-6">
                <Image
                  src="/assets/calendar.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">
                  Last 12 Months
                </p>
                <Image
                  src="/assets/globe.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1 ml-4"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">US</p>
              </div>
              <div className="flex flex-row space-x-4">
                <Image
                  src="/assets/graphPictures/AppPeersD30Retention.svg"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/AppLegend.svg"
                  className="w-16 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Monthly Open Rate
              </h2>
              <div className="flex flex-row items-center mb-6">
                <Image
                  src="/assets/calendar.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">
                  Last 12 Months
                </p>
                <Image
                  src="/assets/globe.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1 ml-4"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200">US</p>
              </div>
              <div className="flex flex-row space-x-4">
                <Image
                  src="/assets/graphPictures/AppPeersOpenRate.svg"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/AppLegend.svg"
                  className="w-16 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppUsageSection;
