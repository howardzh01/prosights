import { useState, useEffect } from "react";
import GenericDoughnut from "./templates/GenericDoughnut";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { convertToChannelDoughnutData } from "../../utils/ChartUtils";
import { INFO_HOVERS } from "../../constants";

function WebTrafficDoughnut({ trafficData, country, selectedChart = null }) {
  if (!trafficData) return null;

  let chartType;
  let title;
  let info;
  switch (selectedChart) {
    case CHARTS.trafficByChannel:
      chartType = "traffic_by_channel";
      title = "Channel";
      info = INFO_HOVERS.TRAFFIC.CHANNEL;
      break;
    case CHARTS.trafficByDevice:
      chartType = "traffic_by_device";
      title = "Device";
      info = INFO_HOVERS.TRAFFIC.DEVICE_BREAKDOWN;
      break;
    case CHARTS.trafficByOrganicVsPaid:
      chartType = "traffic_by_organic_paid";
      title = "Organic vs Paid";
      info = INFO_HOVERS.TRAFFIC.ORGANIC_VS_PAID;
      break;
    // if no selected chart, return by channel
    default:
      chartType = "traffic_by_channel";
  }

  return (
    <div className="px-2 w-full">
      <GenericDoughnut
        chartData={convertToChannelDoughnutData(trafficData, chartType)}
        info={info}
        title={title}
        country={country}
        showModalButtons={true}
        rawChartData={trafficData}
        selectedChart={selectedChart}
      />
    </div>
  );
}

export default WebTrafficDoughnut;
