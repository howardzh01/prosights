import React, { useEffect } from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@nextui-org/react";
import WebTrafficChart from "../charts/WebTrafficChart";
import WebTrafficIcon from "/public/assets/WebsiteTrafficIcon.svg";

function WebsiteTrafficSection({ webTrafficData, webTrafficGeoData }) {
  return (
    <div className="flex flex-col w-full mt-12">
      <div
        id="Website Traffic"
        className="content-section flex items-center py-1 bg-customGray-50 rounded-md"
      >
        <WebTrafficIcon className="mx-2 filter invert" />
        <p className="text-2xl font-semibold text-gray-800">Website Traffic</p>
      </div>
      {/* <p
        id="Website Traffic"
        className="content-section text-2xl font-semibold text-gray-800 pl-2 py-1 bg-customGray-50 rounded-md"
      >
        Website Traffic
      </p> */}
      <hr className="border-t border-customGray-50 mt-2 mb-4" />
      <div className="flex flex-col section-indent">
        <div id="Growth" className="content-section">
          {webTrafficData !== undefined &&
          webTrafficGeoData !== null &&
          Object.keys(webTrafficData).length !== 0 ? (
            <WebTrafficChart trafficData={webTrafficData}></WebTrafficChart>
          ) : (
            <Skeleton className="w-full h-80 rounded-lg bg-customGray-50" />
          )}
        </div>
        <div id="Breakdown" className="content-section">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Breakdown
          </p>
          <div className="flex space-x-8 justify-start">
            {webTrafficGeoData !== undefined &&
            webTrafficGeoData !== null &&
            Object.keys(webTrafficGeoData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebGeoTrafficChart
                  geoTrafficData={webTrafficGeoData}
                  relevant_continents={RELEVANT_CONTINENTS}
                />
              </div>
            ) : (
              <Skeleton className="inline-block w-80 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  selectedChart={CHARTS.trafficByDevice}
                />
              </div>
            ) : (
              <Skeleton className="inline-block w-80 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  selectedChart={CHARTS.trafficByChannel}
                />
              </div>
            ) : (
              <Skeleton className="inline-block w-80 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
            {webTrafficData !== undefined &&
            webTrafficData !== null &&
            Object.keys(webTrafficData).length !== 0 ? (
              <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6">
                <WebTrafficDoughnut
                  trafficData={webTrafficData}
                  selectedChart={CHARTS.trafficByOrganicVsPaid}
                />
              </div>
            ) : (
              <Skeleton className="inline-block w-80 h-64 px-6 py-4 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.03),0_4px_6px_rgba(34,42,53,0.02),0_24px_68px_rgba(47,48,55,0.03),0_2px_3px_rgba(0,0,0,0.02)] bg-customGray-50 border border-customGray-50" />
            )}
          </div>
        </div>
        <div id="Quality Over Time" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Quality Over Time
          </p>
          <div className="flex flex-row w-full justify-between space-x-8">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-2/3">
              <div className="flex flex-row justify-between w-full items-center mb-4">
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
                  src="/assets/graphPictures/totalVisitsByChannelLegend.svg"
                  alt="Company Logo"
                  className="w-10/12 object-contain"
                  width={4096}
                  height={4096}
                />
              </div>
              <div className="flex flex-col">
                <Image
                  src="/assets/graphPictures/totalVisitsByChannel.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto">
                  <div className="inline-block w-[80rem] pb-2">
                    <Image
                      src="/assets/graphPictures/totalVisitsByChannelTable.svg"
                      className="h-96"
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-1/3">
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
                  src="/assets/graphPictures/totalVisitsByChannelAnnual.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto">
                  <div className="inline-block w-[26rem] pt-2 pb-2">
                    <Image
                      src="/assets/graphPictures/totalVisitsByChannelTableAnnual.svg"
                      className="h-96 object-contain"
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="Traffic Growth vs. Peers" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Growth vs. Peers
          </p>
          <div className="flex flex-row w-full justify-between space-x-8">
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
          </div>
        </div>
        <div
          id="Traffic Market Share vs. Peers"
          className="content-section mt-8"
        >
          <p className="text-base font-semibold text-gray-800 mb-3">
            Market Share vs. Peers
          </p>
          <div className="flex flex-row w-full justify-between space-x-8">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-2/3">
              <div className="flex flex-row justify-between w-full items-center mb-4">
                <h2 id="trafficByGeo" className="text-sm font-semibold">
                  Total Visits Market Share (%)
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
                  src="/assets/graphPictures/totalVisitsMarketShare.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto">
                  <div className="inline-block pb-2 w-[77rem] px-2">
                    <Image
                      src="/assets/graphPictures/totalVisitsMarketShareTable.svg"
                      className="object-contain h-auto "
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 pt-3 pb-6 w-1/3">
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
                  src="/assets/graphPictures/totalVisitsMarketShareAnnual.svg"
                  className="h-72 object-contain"
                  width={4096}
                  height={4096}
                />
                <div className="overflow-x-auto pt-2  px-8">
                  <div className="inline-block w-[25rem] pb-2">
                    <Image
                      src="/assets/graphPictures/totalVisitsMarketShareTableAnnual.svg"
                      className="h-auto object-contain"
                      width={4096}
                      height={4096}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="Traffic Breakdown vs. Peers" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Breakdown vs. Peers
          </p>
          <div className="space-x-8 flex flex-row items-center justify-start">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Geography
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
              </div>
              <div className="flex flex-row space-x-4">
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersGeography.svg"
                  className="w-2/3 object-contain"
                  width={4096}
                  height={4096}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersGeographyLegend.svg"
                  className="w-24 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Device
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
                  src="/assets/graphPictures/visitsBreakdownPeersDevice.svg"
                  className="w-2/3 object-contain"
                  width={4096}
                  height={4096}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersDeviceLegend.svg"
                  className="w-20 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Channel
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
                  src="/assets/graphPictures/visitsBreakdownPeersChannel.svg"
                  className="w-2/3 object-contain"
                  width={4096}
                  height={4096}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersChannelLegend.svg"
                  className="w-24 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-6 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
                Search
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
              <div className="flex flex-row space-x-4 pt-6">
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersSearch.svg"
                  className="w-3/5 object-contain"
                  width={4096}
                  height={4096}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersSearchLegend.svg"
                  className="w-24 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteTrafficSection;
