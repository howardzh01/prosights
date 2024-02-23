import { useState, useEffect } from "react";
import { CHARTS, CHARTJS_COLORS } from "../../constants";
import Image from "next/image";
import { convertToAppUsageLoyaltyVsPeersData } from "../../utils/ChartUtils";
import GenericBarAndTable from "./templates/GenericBar";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function AppLoyaltyBreakdownVsPeers({
  multiCompanyAppData,
  country,
  selectedChart = null,
}) {
  // trafficData is of the form {company1: data, company2: data, ...}
  if (!multiCompanyAppData) return null;

  let formatChartLabelFunction;
  switch (selectedChart) {
    case CHARTS.appLTMRetention:
      formatChartLabelFunction = (value) => (value !== null ? `${value}%` : "");
      break;
    case CHARTS.appLTMActiveDays:
      formatChartLabelFunction = (value) => (value !== null ? `${value}%` : "");
      break;
    case CHARTS.appLTMTimePerUser:
      formatChartLabelFunction = (value) =>
        value !== null ? `${value} min` : "";
      break;
    case CHARTS.appLTMTimePerSession:
      formatChartLabelFunction = (value) =>
        value !== null ? `${value} min` : "";
      break;
    // if no selected chart, return by channel
    default:
      return;
  }

  return (
    <div>
      <div className="px-2 h-52">
        <GenericBarAndTable
          data={{
            chartData: convertToAppUsageLoyaltyVsPeersData(
              multiCompanyAppData,
              selectedChart
            ),
            tableData: null,
          }}
          title={selectedChart}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          showModalButtons={false}
          location={country}
          lastTwelveMonthsView={true}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={multiCompanyAppData}
          height={"h-full"}
          useColorPlugin={false}
          formatChartLabelFunction={formatChartLabelFunction}
        />
        {/* <Bar
          data={convertToChannelChartData(multiCompanyAppData, chartType)}
          options={chartOptions}
        ></Bar> */}
      </div>
    </div>
  );
}

export default AppLoyaltyBreakdownVsPeers;
