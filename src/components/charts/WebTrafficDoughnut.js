import { useState, useEffect } from "react";
import GenericDoughnut from "./templates/GenericDoughnut";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficDoughnut({ trafficData, selectedChart = null }) {
  if (!trafficData) return null;

  function convertToChannelChartData(trafficData, type = "traffic_by_channel") {
    const relevant_keys = getRelevantKeys(type);

    // Get the date 12 months ago from today
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    // Initialize an object to accumulate the sums
    const sums = relevant_keys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    // Aggregate data for the last 12 months
    Object.keys(trafficData).forEach((date) => {
      const dataEntry = trafficData[date];
      const entryDate = new Date(date);

      if (entryDate >= date12MonthsAgo) {
        relevant_keys.forEach((key) => {
          if (dataEntry.hasOwnProperty(key)) {
            sums[key] += dataEntry[key];
          }
        });
      }
    });

    // Now that we have total sums for the last 12 months, convert these to percentages
    const total = Object.values(sums).reduce((acc, value) => acc + value, 0);
    const percentages = relevant_keys.map((key) => (sums[key] / total) * 100);

    return {
      labels: relevant_keys,
      datasets: [
        {
          data: percentages,
          borderWidth: 1,
          // Here you could add backgroundColors and other properties as needed
        },
      ],
    };
  }

  function sumLast12Months(trafficData, relevantKeys, startDate) {
    let totals = relevantKeys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    Object.values(trafficData).forEach((dataByDate) => {
      let date = new Date(dataByDate["display_date"]);
      if (date >= startDate) {
        relevantKeys.forEach((key) => {
          totals[key] += dataByDate[key] || 0;
        });
      }
    });

    return totals;
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
      <h2 id="trafficByGeo" className="text-base font-semibold mb-4">
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
      <GenericDoughnut
        chartData={convertToChannelChartData(trafficData, chartType)}
      />
    </div>
  );
}

export default WebTrafficDoughnut;
