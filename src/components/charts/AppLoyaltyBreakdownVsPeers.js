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

  // const chartOptions = {
  //   plugins: {
  //     chartJSColorPlugin: false,
  //     legend: {
  //       display: false,
  //     },
  //     datalabels: {
  //       display: true,
  //       anchor: "end",
  //       align: "top",
  //       // formatter: Math.round,
  //     },
  //   },
  //   layout: {
  //     padding: {
  //       top: 15, // Adjust this value to increase or decrease the space
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false, // Hides x-axis gridlines
  //       },
  //     },
  //     // TODO: maybe display y-axis if timeline === "month" as data labels are turned off on monthly
  //     y: {
  //       display: false, // Hides the y-axis
  //       grid: {
  //         display: false, // Hides y-axis gridlines
  //       },
  //     },
  //   },
  // };

  // function getRelevantKeys(type) {
  //   switch (type) {
  //     case "app_d30_retention":
  //       return ["direct", "mail", "social", "search", "referral", "display_ad"];
  //     case "app_percentage_active_days":
  //       return "est_percentage_active_days";
  //     case "app_average_user_time":
  //       return ["mobile_users", "desktop_users"];
  //     case "app_average_session_time":
  //       return [
  //         "search_organic",
  //         "social_organic",
  //         "search_paid",
  //         "social_paid",
  //       ];
  //     default:
  //       return [];
  //   }
  // }

  let chartType, formatChartLabelFunction;
  let title;
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
