import { useState, useEffect, useMemo } from "react";
import {
  aggregateData,
  convertMonthFormat,
  generateMonthsFromStartYear,
  generateYears,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import GenericDoughnut from "./templates/GenericDoughnut";
import { generateQuarters } from "../../utils/Utils";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebGeoTrafficDoughnut({ geoTrafficData, relevant_continents }) {
  if (!geoTrafficData) return null;

  function convertToGeoDoughnutData(geoTrafficData, outputKey = "traffic") {
    // Get the date 12 months ago from today
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

    // Aggregate data for the last 12 months
    const aggregatedData = Object.entries(geoTrafficData).reduce(
      (acc, [continent, data]) => {
        const yearlyData = Object.entries(data).reduce((sum, [date, value]) => {
          const entryDate = new Date(date);
          if (entryDate >= date12MonthsAgo) {
            sum += value[outputKey] || 0;
          }
          return sum;
        }, 0);
        acc[continent] = yearlyData;
        return acc;
      },
      {}
    );

    // Calculate the total sum of all traffic data for the last 12 months
    const totalTraffic = Object.values(aggregatedData).reduce(
      (sum, value) => sum + value,
      0
    );

    // Convert the aggregated data into percentages
    const percentages = Object.values(aggregatedData).map(
      (value) => (value / totalTraffic) * 100
    );

    // Prepare the data for the Pie chart
    const labels = Object.keys(aggregatedData);

    return {
      labels: labels,
      datasets: [
        {
          data: percentages,
          borderWidth: 1,
        },
      ],
    };
  }

  return (
    <div>
      <h2 id="trafficByGeo" className="text-sm font-semibold mb-3">
        Geography
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
      </div>
      {/* <div className="h-96">
        <GenericStackedBar
          data={convertToGeoChartData(geoTrafficData, "traffic")}
          title={"% Share"}
          showDataLabels={false}
          timescale={timescale}
          setTimescale={setTimescale}
          selectedChart={CHARTS.trafficByGeo}
          rawChartData={geoTrafficData}
        />
      </div> */}
      <div className="px-2">
        <GenericDoughnut
          chartData={convertToGeoDoughnutData(geoTrafficData, "traffic")}
        />
      </div>
    </div>
  );
}

export default WebGeoTrafficDoughnut;
