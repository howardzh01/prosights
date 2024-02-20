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
      title = "Organic vs Paid";
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
          showTimescaleButtons={false}
          title={title}
          location={country}
          lastTwelveMonthsView={true}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={trafficData}
          height={"h-3/4"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeers;
