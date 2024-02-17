import { useState, useEffect } from "react";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { fromUnderscoreCase } from "../../utils/Utils";
import { convertToTrafficBreakdownVsPeersData } from "../../utils/ChartUtils";

function WebTrafficBreakdownVsPeers({
  trafficData,
  country,
  selectedChart = null,
}) {
  // trafficData is of the form {company1: data, company2: data, ...}
  if (!trafficData) return null;

  let chartType;
  let title;
  switch (selectedChart) {
    case CHARTS.trafficByChannel:
      chartType = "traffic_by_channel";
      title = "Channel";
      break;
    case CHARTS.trafficByDevice:
      chartType = "traffic_by_device";
      title = "Device";
      break;
    case CHARTS.trafficByOrganicVsPaid:
      chartType = "traffic_by_organic_paid";
      title = "Search";
      break;
    // if no selected chart, return by channel
    default:
      chartType = "traffic_by_channel";
  }

  return (
    <div>
      <h2 id={title} className="text-sm font-semibold mb-3">
        {title}
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
        <Image
          src="/assets/globe.svg"
          alt="Company Logo"
          className="w-4 h-4 object-contain mr-1 ml-4"
          width={128}
          height={128}
        />
        <p className="text-xs font-normal text-customGray-200">{country}</p>
      </div>
      <div className="px-2 h-52">
        <GenericStackedBar
          data={{
            chartData: convertToTrafficBreakdownVsPeersData(
              trafficData,
              chartType
            ),
            tableData: null,
          }}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={trafficData}
          height={"h-full"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeers;
