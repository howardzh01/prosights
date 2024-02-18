import { useState, useEffect } from "react";
import GenericDoughnut from "./templates/GenericDoughnut";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { convertToChannelDoughnutData } from "../../utils/ChartUtils";

function WebTrafficDoughnut({ trafficData, selectedChart = null }) {
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
      <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
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
        <p className="text-xs font-normal text-customGray-200">US</p>
      </div>
      <div className="px-2">
        <GenericDoughnut
          chartData={convertToChannelDoughnutData(trafficData, chartType)}
        />
      </div>
    </div>
  );
}

export default WebTrafficDoughnut;
