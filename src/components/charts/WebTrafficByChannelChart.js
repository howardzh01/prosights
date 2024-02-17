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
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
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
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
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
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Quality Over Time
            </p>
            <div className="group inline-flex items-center hover:cursor-pointer hover:text-primary">
              <Image
                src="/assets/downloadInactive.svg"
                className="w-5 h-5 object-contain opacity-50 group-hover:hidden"
                width={256}
                height={256}
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-5 h-5 object-contain hidden group-hover:block"
                width={256}
                height={256}
              />
            </div>
          </div>
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
