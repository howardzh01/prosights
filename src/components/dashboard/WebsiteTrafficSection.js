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
  companyDic,
  country,
  webTrafficDic,
  webTrafficGeoDic,
  downloadExcel,
  companyCompetitors,
}) {
  // Expect webTrafficDic = {company1: trafficData, company2: trafficData, ...}
  const companyURLs = [
    ...(companyDic?.url ? [companyDic.url] : []),
    ...companyCompetitors.map((c) => c.url).filter((url) => url !== undefined),
  ];
  const webTrafficData = webTrafficDic?.[company];
  const webTrafficGeoData = webTrafficGeoDic?.[company];

  // NOTE: many checks are reliant on previous checks failing, so first check is usually making sure previous one failed
  // Growth section state checks
  const webTrafficDataUndefinedCheck = webTrafficData === undefined;
  const noGrowthDataAvailableCheck =
    (!webTrafficDataUndefinedCheck &&
      Object.keys(webTrafficData).length === 0) ||
    webTrafficData === null;

  // Visits breakdown state checks
  const webTrafficGeoDataExistsCheck =
    webTrafficGeoData !== undefined &&
    webTrafficGeoData !== null &&
    Object.keys(webTrafficGeoData).length !== 0;
  const noWebTrafficGeoDataAvailableCheck =
    !webTrafficGeoDataExistsCheck &&
    webTrafficGeoData !== undefined &&
    webTrafficGeoData !== null &&
    Object.keys(webTrafficGeoData).length === 0;
  const webTrafficDataExistsCheck =
    webTrafficData !== undefined &&
    webTrafficData !== null &&
    Object.keys(webTrafficData).length !== 0;
  const noWebTrafficDataAvailableCheck =
    !webTrafficDataExistsCheck &&
    webTrafficData !== undefined &&
    webTrafficData !== null &&
    Object.keys(webTrafficData).length === 0;

  // Quality over time state checks
  const qualityOverTimeDataExistsCheck =
    webTrafficData !== undefined && Object.keys(webTrafficData).length !== 0;
  const noQualityOverTimeDataAvailableCheck =
    !qualityOverTimeDataExistsCheck &&
    webTrafficData !== undefined &&
    Object.keys(webTrafficData).length === 0;

  // Growth vs. Peers state checks
  const webTrafficDicIsLoading =
    webTrafficDic === undefined ||
    (webTrafficDic !== null && Object.keys(webTrafficDic).length === 0);
  const noGrowthVsPeersDataAvailableCheck =
    !webTrafficDicIsLoading &&
    (webTrafficDic === null ||
      !(company in webTrafficDic) ||
      Object.keys(webTrafficDic[company]).length === 0);

  // Market share vs. Peers state checks
  const noCompetitorsCheck = companyCompetitors.length === 0;
  const competitorDataLoading =
    !noCompetitorsCheck &&
    (webTrafficDic === undefined ||
      (webTrafficDic !== null && Object.keys(webTrafficDic).length === 0));
  const noMarketShareVsPeersDataAvailableCheck =
    !noCompetitorsCheck &&
    !competitorDataLoading &&
    (webTrafficDic === null ||
      !(company in webTrafficDic) ||
      Object.keys(webTrafficDic[company]).length === 0);

  // Breakdown vs. Peers state checks
  const geographyBreakdownVsPeersDataLoading =
    webTrafficGeoDic === undefined ||
    (webTrafficGeoDic !== null && Object.keys(webTrafficGeoDic).length === 0);
  const noGeographyBreakdownVsPeersDataAvailableCheck =
    !geographyBreakdownVsPeersDataLoading &&
    (webTrafficGeoDic === null ||
      !(company in webTrafficGeoDic) ||
      Object.keys(webTrafficGeoDic[company]).length === 0);
  const trafficBreakdownVsPeersDataLoading =
    webTrafficDic === undefined ||
    (webTrafficDic !== null && Object.keys(webTrafficDic).length === 0);
  const noTrafficBreakdownVsPeersDataAvailableCheck =
    !trafficBreakdownVsPeersDataLoading &&
    (webTrafficDic === null ||
      !(company in webTrafficDic) ||
      Object.keys(webTrafficDic[company]).length === 0);

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
          <div className="flex flex-row pl-6">
            {companyURLs.map((url, index) => {
              const formattedUrl =
                url.startsWith("http://") || url.startsWith("https://")
                  ? url
                  : `https://${url}`;
              return (
                <a
                  key={index}
                  href={formattedUrl}
                  className="text-customGray-300 hover:text-primary hover:border-primary text-sm mr-4 px-4 py-1 border-1 border-customGray-100 rounded-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url}
                </a>
              );
            })}
          </div>
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
          {webTrafficDataUndefinedCheck ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : noGrowthDataAvailableCheck ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Growth Data Available
              </p>
            </div>
          ) : (
            <WebTrafficChart trafficData={webTrafficData} country={country} />
          )}
        </div>
        <div id="Visits Breakdown" className="content-section">
          <div className="flex mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Visits Breakdown
            </p>
          </div>
          <div className="flex flex-row items-center justify-between w-full space-x-8">
            {webTrafficGeoDataExistsCheck ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebGeoTrafficDoughnut
                  geoTrafficData={webTrafficGeoData}
                  relevant_continents={RELEVANT_CONTINENTS}
                />
              </div>
            ) : noWebTrafficGeoDataAvailableCheck ? (
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
            {webTrafficDataExistsCheck ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  country={country}
                  selectedChart={CHARTS.trafficByDevice}
                />
              </div>
            ) : noWebTrafficDataAvailableCheck ? (
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
            {webTrafficDataExistsCheck ? (
              <div className="inline-block w-[30rem] rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  country={country}
                  selectedChart={CHARTS.trafficByChannel}
                />
              </div>
            ) : noWebTrafficDataAvailableCheck ? (
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
            {/* {webTrafficData !== undefined &&
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
            )} */}
          </div>
        </div>
        {/* <div id="Quality Over Time" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Quality Over Time
            </p>
          </div>
          {qualityOverTimeDataExistsCheck ? (
            <WebTrafficByChannelChart
              trafficData={webTrafficData}
              country={country}
            ></WebTrafficByChannelChart>
          ) : noQualityOverTimeDataAvailableCheck ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Quality Over Time Data Available
              </p>
            </div>
          ) : (
            <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
          )}
        </div> */}

        <div id="Traffic Growth vs. Peers" className="content-section mt-8">
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-grxay-800 mr-2">
              Growth vs. Peers
            </p>
          </div>
          {webTrafficDicIsLoading ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : noGrowthVsPeersDataAvailableCheck ? (
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
          {noCompetitorsCheck ? (
            <div className="w-full h-80 rounded-lg bg-transparent flex items-center justify-center">
              <p className="text-2xl font-medium text-customGray-150">
                Add Competitors to Compare
              </p>
            </div>
          ) : competitorDataLoading ? (
            <Skeleton className="w-full mt-2 mb-6 h-80 rounded-lg bg-customGray-50" />
          ) : noMarketShareVsPeersDataAvailableCheck ? (
            <div className="w-full h-80 rounded-lg mt-2 mb-6 bg-customGray-50 flex items-center justify-center">
              <p className="text-sm text-customGray-200">
                No Market Share vs. Peers Data Available
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
          <div className="space-x-8 flex flex-row items-center justify-between w-full">
            {geographyBreakdownVsPeersDataLoading ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : noGeographyBreakdownVsPeersDataAvailableCheck ? (
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
                  selectedChart={CHARTS.trafficCompsByGeo}
                />
              </div>
            )}
            {trafficBreakdownVsPeersDataLoading ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : noTrafficBreakdownVsPeersDataAvailableCheck ? (
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
                  selectedChart={CHARTS.trafficCompsByDevice}
                  country={country}
                />
              </div>
            )}
            {trafficBreakdownVsPeersDataLoading ? (
              <Skeleton className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            ) : noTrafficBreakdownVsPeersDataAvailableCheck ? (
              <div className="inline-block w-96 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-customGray-200">
                    No Channel vs. Peers Data Available
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-[34rem] min-w-0">
                <WebTrafficBreakdownVsPeers
                  trafficData={webTrafficDic}
                  selectedChart={CHARTS.trafficCompsByChannel}
                  country={country}
                />
              </div>
            )}
            {/* {webTrafficDic === undefined ||
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
                  selectedChart={CHARTS.trafficCompsByOrganicVsPaid}
                  country={country}
                />
              </div>
            )} */}

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
