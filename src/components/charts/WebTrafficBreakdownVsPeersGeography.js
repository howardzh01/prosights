import { useState, useEffect, useMemo } from "react";
import {
  aggregateData,
  convertMonthFormat,
  generateMonthsFromStartYear,
  generateYears,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { generateQuarters } from "../../utils/Utils";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficBreakdownVsPeersGeography({
  geoTrafficData,
  relevant_continents,
}) {
  if (!geoTrafficData) return null;

  function convertToGeoData(geoTrafficData, outputKey = "traffic") {
    // Get the date 12 months ago from today
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

    // Initialize an object to hold company-wise percentage breakdowns
    const companyPercentages = {};

    // Iterate over each company in the geoTrafficData
    Object.entries(geoTrafficData).forEach(([company, data]) => {
      // Aggregate data for the last 12 months for each company
      const aggregatedData = Object.entries(data).reduce(
        (acc, [continent, continentData]) => {
          const yearlyData = Object.entries(continentData).reduce(
            (sum, [date, value]) => {
              const entryDate = new Date(date);
              if (entryDate >= date12MonthsAgo) {
                sum += value[outputKey] || 0;
              }
              return sum;
            },
            0
          );
          acc[continent] = yearlyData;
          return acc;
        },
        {}
      );

      // Calculate the total sum of all traffic data for the last 12 months for the company
      const totalTraffic = Object.values(aggregatedData).reduce(
        (sum, value) => sum + value,
        0
      );

      // Convert the aggregated data into percentages for the company
      const percentages = Object.entries(aggregatedData).reduce(
        (acc, [continent, value]) => {
          acc[continent] = (value / totalTraffic) * 100;
          return acc;
        },
        {}
      );

      // Assign the calculated percentages to the company
      companyPercentages[company] = percentages;
    });

    // Prepare the data for the chart
    const companies = Object.keys(companyPercentages);
    let continents = companies
      .reduce((acc, company) => {
        const companyData = companyPercentages[company];
        Object.keys(companyData).forEach((continent) => {
          if (!acc.includes(continent)) acc.push(continent);
        });
        return acc;
      }, [])
      .sort();

    // Ensure North America is always first
    const northAmericaIndex = continents.indexOf("North America");
    if (northAmericaIndex > -1) {
      continents.splice(northAmericaIndex, 1);
      continents = ["North America", ...continents];
    }

    const dataset = continents.map((continent) => {
      const data = companies.map(
        (company) => companyPercentages[company][continent] || 0
      );
      return {
        label: continent,
        data: data,
        borderWidth: 1,
      };
    });

    return {
      labels: companies,
      datasets: dataset,
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
      <div className="px-2 h-52">
        <GenericStackedBar
          data={{
            chartData: convertToGeoData(geoTrafficData, "traffic"),
            tableData: null,
          }}
          showTable={false}
          showDataLabels={true}
          showTimescaleButtons={false}
          timescale={"quarterYear"}
          setTimescale={null}
          selectedChart={null}
          rawChartData={geoTrafficData}
          height={"h-full"}
          legendPosition={"right"}
        />
      </div>
    </div>
  );
}

export default WebTrafficBreakdownVsPeersGeography;
