import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToChannelChartData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS, INFO_HOVERS } from "../../constants";
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

  let title, chartType;
  switch (selectedChart) {
    case CHARTS.trafficByChannel:
      chartType = "traffic_by_channel";
      title = "Total Visits by Channel (%)";
      break;
    case CHARTS.trafficByDevice:
      chartType = "traffic_by_device";
      title = "Device";
      break;
    case CHARTS.trafficByOrganicVsPaid:
      chartType = "traffic_by_organic_paid";
      title = "Organic vs Paid";
      break;
    // if no selected chart, return by channel
    default:
      chartType = "traffic_by_channel";
      title = "Total Visits by Channel (%)";
  }

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        chartType,
        trafficByChannelTimescale,
        cutOffDate
      )}
      title={title}
      // info={INFO_HOVERS.TRAFFIC.CHANNEL}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={selectedChart || CHARTS.trafficByChannel} // default to traffic by channel if NULL
      rawChartData={trafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      location={country}
    />
  );
  const yearTrafficByChannelGraph = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        chartType,
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

  if (selectedChart) {
    return (
      <TwoColumnView
        quarterGraph={trafficByChannel}
        yearGraph={yearTrafficByChannelGraph}
      />
    );
  } else {
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
