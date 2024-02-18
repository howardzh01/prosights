import { useState, useEffect } from "react";
import { CHARTS, CHARTJS_COLORS } from "../../constants";
import Image from "next/image";
import { calculateMean, roundPeNumbers } from "../../utils/Utils";
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

  function convertToChannelChartData(
    multiCompanyAppData,
    type = CHARTS.appLTMTimePerUser
  ) {
    // const relevant_keys = getRelevantKeys(type);

    // Get the date 12 months ago from today
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 13);

    const companyAverages = {};
    for (const [company, data] of Object.entries(multiCompanyAppData)) {
      if (!data) continue;
      let filteredData;
      // Handle retentiion data differently
      if (type === CHARTS.appLTMRetention) {
        if (!data["retention"]) continue;
        filteredData = Object.entries(data["retention"])
          .filter(([time, data]) => new Date(time) >= date12MonthsAgo)
          // .map(([time, data]) => data.est_percentage_active_days);
          .reduce((obj, [time, data]) => {
            let estD30Retention = data.filter(
              (item) => item?.retention_days === 30
            )?.[0]?.est_retention_value;
            obj[time] = estD30Retention * 100;
            return obj;
          }, {});
      } else {
        if (!data["app_performance"]) continue;
        filteredData = Object.entries(data["app_performance"])
          .filter(([time, data]) => new Date(time) >= date12MonthsAgo)
          // .map(([time, data]) => data.est_percentage_active_days);
          .reduce((obj, [time, data]) => {
            if (type === CHARTS.appLTMActiveDays) {
              obj[time] =
                data.est_percentage_active_days === null
                  ? null
                  : data.est_percentage_active_days * 100;
            } else if (type === CHARTS.appLTMTimePerUser) {
              obj[time] =
                data.est_average_time_per_user === null
                  ? null
                  : data.est_average_time_per_user / 60 / 1000;
            } else if (type === CHARTS.appLTMTimePerSession) {
              obj[time] =
                data.est_average_session_duration === null
                  ? null
                  : data.est_average_session_duration / 60 / 1000;
            }
            return obj;
          }, {});
      }

      if (company === "Grailed") {
        console.log(filteredData, calculateMean(Object.values(filteredData)));
      }
      // console.log(Object.keys(filteredData).length);
      companyAverages[company] = roundPeNumbers(
        calculateMean(Object.values(filteredData))
      );
    }
    const datasets = [
      {
        label: "",
        data: Object.values(companyAverages), // [15, 10, 8]
        backgroundColor: CHARTJS_COLORS,
        barThickness: 48,
      },
    ];

    return {
      labels: Object.keys(companyAverages), // Single label as we have separate datasets for each company
      datasets: datasets,
    };
  }

  const chartOptions = {
    plugins: {
      chartJSColorPlugin: false,
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        anchor: "end",
        align: "top",
        // formatter: Math.round,
      },
    },
    layout: {
      padding: {
        top: 15, // Adjust this value to increase or decrease the space
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hides x-axis gridlines
        },
      },
      // TODO: maybe display y-axis if timeline === "month" as data labels are turned off on monthly
      y: {
        display: false, // Hides the y-axis
        grid: {
          display: false, // Hides y-axis gridlines
        },
      },
    },
  };

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
            chartData: convertToChannelChartData(
              multiCompanyAppData,
              selectedChart
            ),
            tableData: null,
          }}
          title={selectedChart}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          showModalButtons={true}
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
