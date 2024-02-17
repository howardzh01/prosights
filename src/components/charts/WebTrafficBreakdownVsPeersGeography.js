import { useState, useEffect, useMemo } from "react";
import { convertToTrafficBreakdownVsPeersGeoData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { generateQuarters } from "../../utils/Utils";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficBreakdownVsPeersGeography({
  geoTrafficData,
  relevant_continents,
}) {
  if (!geoTrafficData) return null;

  return (
    <div>
      <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
        Geography
      </h2>
      <div className="flex flex-row items-center mb-8">
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
      {/* <div className="h-96">
        <GenericStackedBar
          data={convertToGeoChartData(geoTrafficData, "traffic")}
          title={"% Share"}
          showDataLabels={false}
          timescale={timescale}
          setTimescale={setTimescale}
          selectedChart={CHARTS.trafficByGeo}
          rawChartData={geoTrafficData}
        />
      </div> */}
      <div className="px-2 h-52">
        <GenericStackedBar
          data={{
            chartData: convertToTrafficBreakdownVsPeersGeoData(
              geoTrafficData,
              "traffic"
            ),
            tableData: null,
          }}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={geoTrafficData}
          height={"h-full"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeersGeography;
