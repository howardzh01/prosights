import { useState, useEffect } from "react";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";
import { fromUnderscoreCase } from "../../utils/Utils";

function WebTrafficBreakdownVsPeers({
  trafficData,
  country,
  selectedChart = null,
}) {
  // trafficData is of the form {company1: data, company2: data, ...}
  if (!trafficData) return null;

  function convertToChannelChartData(trafficData, type = "traffic_by_channel") {
    const relevant_keys = getRelevantKeys(type);

    // Get the date 12 months ago from today
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

    // Initialize an object to accumulate the sums
    const sums = relevant_keys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    // Initialize an object to hold company-wise percentage breakdowns
    // E.g. {company1: [10, 20, 30], company2: [10, 20, 30], ...}
    const companyPercentages = {};

    // Iterate over each company in the trafficData
    Object.keys(trafficData).forEach((company) => {
      const companyData = trafficData[company];
      const companySums = {};

      // Aggregate data for the last 12 months for each company
      Object.keys(companyData).forEach((date) => {
        const dataEntry = companyData[date];
        const entryDate = new Date(date);

        if (entryDate >= date12MonthsAgo) {
          relevant_keys.forEach((key) => {
            if (!companySums[key]) companySums[key] = 0;
            if (dataEntry.hasOwnProperty(key)) {
              companySums[key] += dataEntry[key];
            }
          });
        }
      });

      // Calculate total sum for the last 12 months for the company
      const total = Object.values(companySums).reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert these to percentages for each relevant key
      const percentages = relevant_keys.reduce((acc, key) => {
        acc[key] = (companySums[key] / total) * 100;
        return acc;
      }, {});

      // Assign the calculated percentages to the company
      companyPercentages[company] = percentages;
    });

    return {
      labels: Object.keys(companyPercentages),
      datasets: [
        ...relevant_keys.map((key) => ({
          data: Object.values(companyPercentages).map(
            (percentages) => percentages[key]
          ),
          borderWidth: 1,
          label: fromUnderscoreCase(key),
        })),
      ],
    };
  }

  function getRelevantKeys(type) {
    switch (type) {
      case "traffic_by_channel":
        return ["direct", "mail", "social", "search", "referral", "display_ad"];
      case "traffic_by_device":
        return ["mobile_visits", "desktop_visits"];
      case "users_by_device":
        return ["mobile_users", "desktop_users"];
      case "traffic_by_organic_paid":
        return [
          "search_organic",
          "social_organic",
          "search_paid",
          "social_paid",
        ];
      default:
        return [];
    }
  }

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
        <p className="text-xs font-normal text-customGray-200">{country}</p>
      </div>
      <div className="px-2 h-52">
        <GenericStackedBar
          data={{
            chartData: convertToChannelChartData(trafficData, chartType),
            tableData: null,
          }}
          title={"Hello"}
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
