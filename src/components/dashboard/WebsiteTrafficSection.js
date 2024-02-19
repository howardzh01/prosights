import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficDoughnut from "../charts/WebGeoTrafficDoughnut";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";
import WebTrafficChart from "../charts/WebTrafficChart";
import WebTrafficByChannelChart from "../charts/WebTrafficByChannelChart";
import WebTrafficIcon from "/public/assets/WebsiteTrafficIcon.svg";
import WebTrafficStackedBarPeers from "../charts/WebTrafficStackedBarPeers";
import WebTrafficBreakdownVsPeers from "../charts/WebTrafficBreakdownVsPeers";
import WebTrafficBreakdownVsPeersGeography from "../charts/WebTrafficBreakdownVsPeersGeography";
import WebTrafficCompetitorLineCharts from "../charts/WebTrafficCompetitorLineCharts";

function WebsiteTrafficSection({
  company,
  country,
  webTrafficDic,
  webTrafficGeoDic,
  downloadExcel,
}) {
  // Expect webTrafficDic = {company1: trafficData, company2: trafficData, ...}
  const webTrafficData = webTrafficDic?.[company];
  const webTrafficGeoData = webTrafficGeoDic?.[company];

  return (
    <div className="flex flex-col w-full mt-12">
      <div
        id="Website Traffic"
        className="content-section flex items-end justify-between mt-2 mb-3 rounded-md"
      >
        <div className="flex flex-row items-center">
          <WebTrafficIcon className="mx-2 filter invert w-6 h-6" />
          <p className="text-3xl font-semibold text-gray-800 ">
            Website Traffic
          </p>
          <a
            className="group inline-flex items-center hover:cursor-pointer hover:text-primary pl-4"
            onClick={() => downloadExcel("Web Traffic")}
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
            src="/assets/poweredByLogos/semrush_logo.svg"
            alt="coresignal"
            width="120"
            height="120"
            className="h-4 w-auto"
          />
        </div>
      </div>
      <hr className="border-none h-px bg-customGray-100" />

      <div className="flex flex-col section-indent mt-4">
        <div id="Growth" className="content-section">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">Growth</p>
          </div>
          {webTrafficData === undefined ||
          Object.keys(webTrafficData).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : Object.keys(webTrafficData).length === 0 ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Growth Data Available
              </p>
            </div>
          ) : (
            <WebTrafficChart trafficData={webTrafficData} country={country} />
          )}
        </div>
        <div id="Breakdown" className="content-section">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Breakdown
            </p>
          </div>
          <div className="flex space-x-8 justify-start">
            {webTrafficGeoData !== undefined &&
            webTrafficGeoData !== null &&
            Object.keys(webTrafficGeoData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebGeoTrafficDoughnut
                  geoTrafficData={webTrafficGeoData}
                  relevant_continents={RELEVANT_CONTINENTS}
                />
              </div>
            ) : webTrafficGeoData !== undefined &&
              Object.keys(webTrafficGeoData).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Geography Data Available
                  </p>
                </div>
              </div>
            ) : (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  country={country}
                  selectedChart={CHARTS.trafficByDevice}
                />
              </div>
            ) : webTrafficData !== undefined &&
              Object.keys(webTrafficData).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Device Data Available
                  </p>
                </div>
              </div>
            ) : (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  country={country}
                  selectedChart={CHARTS.trafficByChannel}
                />
              </div>
            ) : webTrafficData !== undefined &&
              Object.keys(webTrafficData).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Channel Data Available
                  </p>
                </div>
              </div>
            ) : (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  country={country}
                  selectedChart={CHARTS.trafficByOrganicVsPaid}
                />
              </div>
            ) : webTrafficData !== undefined &&
              Object.keys(webTrafficData).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Search Data Available
                  </p>
                </div>
              </div>
            ) : (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
          </div>
        </div>
        <div id="Quality Over Time" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Quality Over Time
            </p>
          </div>
          {webTrafficData !== undefined &&
          Object.keys(webTrafficData).length !== 0 ? (
            <WebTrafficByChannelChart
              trafficData={webTrafficData}
              country={country}
            ></WebTrafficByChannelChart>
          ) : webTrafficData !== undefined &&
            Object.keys(webTrafficData).length === 0 ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Quality Over Time Data Available
              </p>
            </div>
          ) : (
            <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
          )}
        </div>

        <div id="Traffic Growth vs. Peers" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-grxay-800 mr-2">
              Growth vs. Peers
            </p>
          </div>
          {webTrafficDic === undefined ||
          Object.keys(webTrafficDic).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : Object.keys(webTrafficDic[company]).length === 0 ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Growth vs. Peers Data Available
              </p>
            </div>
          ) : (
            <WebTrafficCompetitorLineCharts
              multiCompanyTrafficData={webTrafficDic}
              country={country}
            />
          )}

          {/* <div className="flex flex-row w-full justify-between space-x-8">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-2/3">
              <div className="flex flex-row justify-between w-full items-center mb-4">
                <h2 id="trafficByGeo" className="text-sm font-semibold">
                  Visits Growth
                </h2>
                <div className="flex items-center gap-1">
                  <div className="mr-2 flex items-center">
                    <button type="button" disabled={true} className="mr-1">
                      <MinusCircleIcon
                        className={`w-6 h-6 text-customGray-100
                }`}
                      />
                    </button>
                    <button type="button" disabled={false}>
                      <PlusCircleIcon
                        className={`w-6 h-6 text-customGray-400`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center mb-2">
                <Image
                  src="/assets/globe.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200 mr-12">
                  US
                </p>
                <Image
                  src="/assets/graphPictures/visitsGrowthLegend.svg"
                  alt="Company Logo"
                  className="w-48 object-contain"
                  width={4096}
                  height={4096}
                />
              </div>
              <div className="flex flex-col">
                <Image
                  src="/assets/graphPictures/visitsGrowth.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto">
                  <div className="inline-block w-[80rem] h-auto pb-2">
                    <Image
                      src="/assets/graphPictures/visitsGrowthTable.svg"
                      className="h-40 object-contain"
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 pt-3 pb-6  w-1/3">
              <div className="flex flex-row justify-between w-full items-center mb-4 opacity-0">
                <h2 id="trafficByGeo" className="text-sm font-semibold">
                  Total Visits by Channel (%)
                </h2>
                <div className="flex items-center gap-1">
                  <div className="mr-2 flex items-center">
                    <button type="button" disabled={true} className="mr-1">
                      <MinusCircleIcon
                        className={`w-6 h-6 text-customGray-100
                }`}
                      />
                    </button>
                    <button type="button" disabled={false}>
                      <PlusCircleIcon
                        className={`w-6 h-6 text-customGray-400`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center mb-2 opacity-0">
                <Image
                  src="/assets/globe.svg"
                  alt="Company Logo"
                  className="w-4 h-4 object-contain mr-1"
                  width={128}
                  height={128}
                />
                <p className="text-xs font-normal text-customGray-200 mr-12">
                  US
                </p>
                <Image
                  src="/assets/graphPictures/totalVisitsByChannelLegend.svg"
                  alt="Company Logo"
                  className="w-10/12 object-contain"
                  width={4096}
                  height={4096}
                />
              </div>
              <div className="flex flex-col">
                <Image
                  src="/assets/graphPictures/visitsGrowthAnnual.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto pt-2">
                  <div className="inline-block w-[30rem] px-4 pb-2">
                    <Image
                      src="/assets/graphPictures/visitsGrowthTableAnnual.svg"
                      className="h-40 object-contain"
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div
          id="Traffic Market Share vs. Peers"
          className="content-section mt-8"
        >
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Market Share vs. Peers
            </p>
          </div>
          {webTrafficDic === undefined ||
          Object.keys(webTrafficDic).length === 0 ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : Object.keys(webTrafficDic[company]).length === 0 ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Growth vs. Peers Data Available
              </p>
            </div>
          ) : (
            <WebTrafficStackedBarPeers
              multiCompanyTrafficData={webTrafficDic}
              country={country}
            ></WebTrafficStackedBarPeers>
          )}
        </div>
        <div id="Traffic Breakdown vs. Peers" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Breakdown vs. Peers
            </p>
          </div>
          <div className="space-x-8 flex flex-row items-center justify-start w-full">
            {webTrafficGeoDic === undefined ||
            Object.keys(webTrafficGeoDic).length === 0 ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : Object.keys(webTrafficGeoDic[company]).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Geography vs. Peers Data Available
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                <WebTrafficBreakdownVsPeersGeography
                  geoTrafficData={webTrafficGeoDic}
                  relevant_continents={RELEVANT_CONTINENTS}
                />
              </div>
            )}
            {webTrafficDic === undefined ||
            Object.keys(webTrafficDic).length === 0 ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : Object.keys(webTrafficDic[company]).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Device vs. Peers Data Available
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                <WebTrafficBreakdownVsPeers
                  trafficData={webTrafficDic}
                  selectedChart={CHARTS.trafficByDevice}
                  country={country}
                />
              </div>
            )}
            {webTrafficDic === undefined ||
            Object.keys(webTrafficDic).length === 0 ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : Object.keys(webTrafficDic[company]).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Channel vs. Peers Data Available
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                <WebTrafficBreakdownVsPeers
                  trafficData={webTrafficDic}
                  selectedChart={CHARTS.trafficByChannel}
                  country={country}
                />
              </div>
            )}
            {webTrafficDic === undefined ||
            Object.keys(webTrafficDic).length === 0 ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : Object.keys(webTrafficDic[company]).length === 0 ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Search vs. Peers Data Available
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
                <WebTrafficBreakdownVsPeers
                  trafficData={webTrafficDic}
                  selectedChart={CHARTS.trafficByOrganicVsPaid}
                  country={country}
                />
              </div>
            )}

            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
              <WebTrafficBreakdownVsPeersGeography
                geoTrafficData={webTrafficGeoDic}
                relevant_continents={RELEVANT_CONTINENTS}
              />
            </div> */}
            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
              <WebTrafficBreakdownVsPeers
                trafficData={webTrafficDic}
                selectedChart={CHARTS.trafficByDevice}
                country={country}
              />
            </div> */}
            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
              <WebTrafficBreakdownVsPeers
                trafficData={webTrafficDic}
                selectedChart={CHARTS.trafficByChannel}
                country={country}
              />
            </div> */}
            {/* <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/4 min-w-0">
              <WebTrafficBreakdownVsPeers
                trafficData={webTrafficDic}
                selectedChart={CHARTS.trafficByOrganicVsPaid}
                country={country}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteTrafficSection;
