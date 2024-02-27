import { useState, useEffect } from "react";
import { CHARTS, CHARTJS_COLORS, INFO_HOVERS } from "../../constants";
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
  let info;
  switch (selectedChart) {
    case CHARTS.appLTMRetentionM3:
      formatChartLabelFunction = (value) => (value !== null ? `${value}%` : "");
      info = INFO_HOVERS.APP_USAGE.M6_USAGE_RETENTION;
      break;
    case CHARTS.appLTMRetentionM6:
      formatChartLabelFunction = (value) => (value !== null ? `${value}%` : "");
      info = INFO_HOVERS.APP_USAGE.ACTIVE_DAYS;
      break;
    case CHARTS.appLTMTimePerUser:
      formatChartLabelFunction = (value) =>
        value !== null ? `${value} min` : "";
      info = INFO_HOVERS.APP_USAGE.AVG_TIME_PER_USER;
      break;
    case CHARTS.appLTMTimePerSession:
      formatChartLabelFunction = (value) =>
        value !== null ? `${value} min` : "";
      info = INFO_HOVERS.APP_USAGE.AVG_TIME_PER_SESSION;
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
          info={info}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          showModalButtons={true}
          location={country}
          lastTwelveMonthsView={true}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={selectedChart}
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
