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

function WebGeoTrafficDoughnut({
  geoTrafficData,
  relevant_continents,
  startDate = "2019",
}) {
  const [startDateState, setStartDateState] = useState(startDate);
  const [timescale, setTimescale] = useState("year");

  const monthLabels = useMemo(
    () => generateMonthsFromStartYear(startDateState),
    [startDateState]
  ).map((date) => convertMonthFormat(date));

  const quarterLabels = useMemo(
    () => generateQuarters(startDateState),
    [startDateState]
  );

  const yearLabels = useMemo(
    () => generateYears(startDateState),
    [startDateState]
  );

  let displayedLabels;
  switch (timescale) {
    case "month":
      displayedLabels = monthLabels;
      break;
    case "quarterYear":
      displayedLabels = quarterLabels;
      break;
    case "year":
      displayedLabels = yearLabels;
      break;
    default:
      displayedLabels = yearLabels;
  }

  if (!geoTrafficData) return null;

  function convertToGeoChartData(trafficData, outputKey = "traffic") {
    const aggData = relevant_continents.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData[key], outputKey, "sum", timescale);
      return acc;
    }, {});

    return {
      labels: displayedLabels,
      datasets: relevant_continents.map((key) => {
        return {
          data: displayedLabels.map((time) =>
            aggData[key] ? aggData[key][time] / 1e6 : 0
          ),
          borderWidth: 1,
          label: key,
        };
      }),
    };
  }

  function convertToGeoDoughnutData(geoTrafficData, outputKey = "traffic") {
    // Find the most recent date in the data
    const mostRecentDate = new Date(
      Math.max(
        ...Object.values(geoTrafficData).flatMap((continentData) =>
          Object.keys(continentData).map((date) => new Date(date))
        )
      )
    );

    // Format the date to match the keys in the geoTrafficData object
    const mostRecentYear = mostRecentDate.getUTCFullYear();

    // Aggregate data for the most recent year
    const aggregatedData = Object.entries(geoTrafficData).reduce(
      (acc, [continent, data]) => {
        const yearlyData = Object.entries(data).reduce((sum, [date, value]) => {
          const year = new Date(date).getUTCFullYear();
          if (year === mostRecentYear) {
            sum += value[outputKey] || 0;
          }
          return sum;
        }, 0);
        acc[continent] = yearlyData;
        return acc;
      },
      {}
    );

    // Calculate the total sum of all traffic data for the most recent year
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
