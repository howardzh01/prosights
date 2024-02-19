import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToChannelChartData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficByChannelChart({
  trafficData,
  country,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer

  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("quarterYear");

  if (!trafficData) return null;

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        trafficByChannelTimescale,
        cutOffDate
      )}
      title={"Total Visits by Channel (%)"}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={CHARTS.trafficByChannel}
      rawChartData={trafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      location={country}
    />
  );
  const yearTrafficByChannelGraph = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        "year",
        cutOffDate
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      displayLegend={false}
    />
  );

  switch (selectedChart) {
    case CHARTS.trafficByChannel:
      return trafficByChannel;

    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="h-fit mb-4">
            <TwoColumnView
              quarterGraph={trafficByChannel}
              yearGraph={yearTrafficByChannelGraph}
            />
          </div>
        </div>
      );
  }
}

export default WebTrafficByChannelChart;
