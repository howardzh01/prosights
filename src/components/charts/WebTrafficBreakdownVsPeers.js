import { useState, useEffect } from "react";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS, INFO_HOVERS } from "../../constants";
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
  let info;
  switch (selectedChart) {
    case CHARTS.trafficCompsByChannel:
      chartType = "traffic_by_channel";
      title = "Channel";
      info = INFO_HOVERS.TRAFFIC.CHANNEL;
      break;
    case CHARTS.trafficCompsByDevice:
      chartType = "traffic_by_device";
      title = "Device";
      info = INFO_HOVERS.TRAFFIC.DEVICE_BREAKDOWN;
      break;
    case CHARTS.trafficCompsByOrganicVsPaid:
      chartType = "traffic_by_organic_paid";
      title = "Organic vs Paid";
      info = INFO_HOVERS.TRAFFIC.ORGANIC_VS_PAID;
      break;
    // if no selected chart, return by channel
    default:
      chartType = "traffic_by_channel";
  }

  return (
    <div>
      <div className="px-2 h-64">
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
          showModalButtons={true}
          showTimescaleButtons={false}
          title={title}
          info={info}
          location={country}
          lastTwelveMonthsView={true}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={selectedChart}
          rawChartData={trafficData}
          height={"h-3/4"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeers;
