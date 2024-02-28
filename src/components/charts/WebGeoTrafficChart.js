import { convertToGeoMarketShareData } from "../../utils/ChartUtils";
import { useState } from "react";
import GenericStackedBar from "./templates/GenericStackedBar";
import { roundPeNumbers } from "../../utils/Utils";
import TwoColumnView from "./templates/TwoColumnView";

function WebGeoTrafficChart({
  geoTrafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  const [trafficByGeoTimescale, setTrafficByGeoTimescale] =
    useState("quarterYear");

  const trafficByGeoChart = (
    <GenericStackedBar
      data={convertToGeoMarketShareData(
        geoTrafficData,
        trafficByGeoTimescale,
        cutOffDate
      )}
      title={"Geography"}
      showDataLabels={trafficByGeoTimescale === "quarterYear"}
      timescale={trafficByGeoTimescale}
      setTimescale={setTrafficByGeoTimescale}
      selectedChart={selectedChart} // default to traffic by channel if NULL
      rawChartData={geoTrafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
    />
  );
  const yearTrafficByGeoChart = (
    <GenericStackedBar
      data={convertToGeoMarketShareData(geoTrafficData, "year", cutOffDate)}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      displayLegend={false}
    />
  );
  return (
    <div className="">
      <TwoColumnView
        quarterGraph={trafficByGeoChart}
        yearGraph={yearTrafficByGeoChart}
      />
    </div>
  );
}

export default WebGeoTrafficChart;
