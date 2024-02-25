import { useState, useEffect, useMemo } from "react";
import { convertToTrafficBreakdownVsPeersGeoData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { generateQuarters } from "../../utils/Utils";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { INFO_HOVERS } from "../../constants";

function WebTrafficBreakdownVsPeersGeography({
  geoTrafficData,
  relevant_continents,
}) {
  if (!geoTrafficData) return null;

  return (
    <div>
      <div className="px-2 h-64">
        <GenericStackedBar
          data={{
            chartData: convertToTrafficBreakdownVsPeersGeoData(
              geoTrafficData,
              "traffic"
            ),
            tableData: null,
          }}
          showTable={false}
          title={"Geography"}
          info={INFO_HOVERS.TRAFFIC.GEOGRAPHY}
          lastTwelveMonthsView={true}
          showDataLabels={true}
          showTimescaleButtons={false}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={geoTrafficData}
          height={"h-3/4"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeersGeography;
