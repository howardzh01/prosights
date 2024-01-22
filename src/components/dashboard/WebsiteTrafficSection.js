import React from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";
import Image from "next/image";

function WebsiteTrafficSection({ webTrafficData, webTrafficGeoData }) {
  return (
    <div className="flex flex-col w-full mt-12 pb-8">
      <p
        id="Website Traffic"
        className="content-section text-2xl font-semibold text-gray-800 ml-2"
      >
        Website Traffic
      </p>
      <hr className="border-t border-customGray-50 mt-2 mb-4" />
      <div className="mx-4 flex flex-col">
        <div id="Visits Breakdown" className="content-section">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Visits Breakdown
          </p>
          <div className="space-x-6">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebGeoTrafficChart
                geoTrafficData={webTrafficGeoData}
                relevant_continents={RELEVANT_CONTINENTS}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByDevice}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByChannel}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByOrganicVsPaid}
              />
            </div>
          </div>
        </div>
        <div id="Traffic Momentum" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Traffic Momentum
          </p>
          <div className="space-x-6">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebGeoTrafficChart
                geoTrafficData={webTrafficGeoData}
                relevant_continents={RELEVANT_CONTINENTS}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByDevice}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByChannel}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByOrganicVsPaid}
              />
            </div>
          </div>
        </div>
        <div id="Traffic Quality" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Traffic Quality
          </p>
          <div className="space-x-6">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebGeoTrafficChart
                geoTrafficData={webTrafficGeoData}
                relevant_continents={RELEVANT_CONTINENTS}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByDevice}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByChannel}
              />
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6">
              <WebTrafficDoughnut
                trafficData={webTrafficData}
                selectedChart={CHARTS.trafficByOrganicVsPaid}
              />
            </div>
          </div>
        </div>
        <div id="Traffic Quality" className="content-section mt-8">
          <p className="text-base font-semibold text-gray-800 mb-3">
            Visits Breakdown vs. Peers
          </p>
          <div className="space-x-6 flex flex-row items-center">
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-base font-semibold mb-4">
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
                  src="/assets/graphPictures/visitsBreakdownPeersGeography.png"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersGeographyLegend.svg"
                  className="w-24 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-base font-semibold mb-4">
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
                  src="/assets/graphPictures/visitsBreakdownPeersDevice.png"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersDeviceLegend.svg"
                  className="w-20 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6 w-96 h-full">
              <h2 id="trafficByGeo" className="text-base font-semibold mb-4">
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
                  src="/assets/graphPictures/visitsBreakdownPeersChannel.png"
                  className="w-2/3 object-contain"
                  width={5120}
                  height={5120}
                />
                <Image
                  src="/assets/graphPictures/visitsBreakdownPeersChannelLegend.svg"
                  className="w-24 h-auto object-contain"
                  width={512}
                  height={512}
                />
              </div>
            </div>
            <div className="inline-block rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-white border border-customGray-50 px-4 pt-3 pb-6 w-96">
              <h2 id="trafficByGeo" className="text-base font-semibold mb-4">
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
                  src="/assets/graphPictures/visitsBreakdownPeersSearch.png"
                  className="w-3/5 object-contain"
                  width={5120}
                  height={5120}
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
