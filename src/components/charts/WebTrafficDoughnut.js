import { useState, useEffect } from "react";
import GenericDoughnut from "./templates/GenericDoughnut";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { convertToChannelDoughnutData } from "../../utils/ChartUtils";

function WebTrafficDoughnut({ trafficData, country, selectedChart = null }) {
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
      title = "Organic vs Paid";
      break;
    // if no selected chart, return by channel
    default:
      chartType = "traffic_by_channel";
  }

  return (
    <div className="px-2 w-full">
      <GenericDoughnut
        chartData={convertToChannelDoughnutData(trafficData, chartType)}
        title={title}
        country={country}
      />
    </div>
  );
}

export default WebTrafficDoughnut;
