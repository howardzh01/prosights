import React from "react";
import { RELEVANT_CONTINENTS, CHARTS } from "../../constants";
import WebGeoTrafficChart from "../charts/WebGeoTrafficChart";
import WebTrafficDoughnut from "../charts/WebTrafficDoughnut";

function WebsiteTrafficSection({ webTrafficData, webTrafficGeoData }) {
  return (
    <div className="flex flex-col w-full mt-12 pb-8">
      <p className="text-2xl font-semibold text-gray-800 ml-2">
        Website Traffic
      </p>
      <hr className="border-t border-customGray-50 mt-2 mb-4" />
      <div className="mx-4 flex flex-col">
        <p className="text-base font-semibold text-gray-800 mb-3">
          Visits Breakdown
        </p>
        <div className="space-x-8">
          <div className="inline-block rounded-lg drop-shadow-sm bg-white border border-customGray-50 px-4 pt-3 pb-6">
            <WebGeoTrafficChart
              geoTrafficData={webTrafficGeoData}
              relevant_continents={RELEVANT_CONTINENTS}
            />
          </div>
          <div className="inline-block rounded-lg drop-shadow-sm bg-white border border-customGray-50 px-4 pt-3 pb-6">
            <WebTrafficDoughnut
              trafficData={webTrafficData}
              selectedChart={CHARTS.trafficByDevice}
            />
          </div>
          <div className="inline-block rounded-lg drop-shadow-sm bg-white border border-customGray-50 px-4 pt-3 pb-6">
            <WebTrafficDoughnut
              trafficData={webTrafficData}
              selectedChart={CHARTS.trafficByChannel}
            />
          </div>
          <div className="inline-block rounded-lg drop-shadow-sm bg-white border border-customGray-50 px-4 pt-3 pb-6">
            <WebTrafficDoughnut
              trafficData={webTrafficData}
              selectedChart={CHARTS.trafficByOrganicVsPaid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteTrafficSection;
