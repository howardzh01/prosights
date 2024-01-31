import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import {
  aggregateData,
  findInsertIndex,
  getTableInfo,
  convertLabelToDate,
  roundPeNumbers,
  normalizeStackedAggData,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

const displayedKeyMap = {
  direct: "Direct",
  mail: "Mail",
  referral: "Referral",
  social: "Social",
  search_organic: "Organic Search",
  social_organic: "Organic Social",
  search_paid: "Paid Search",
  social_paid: "Paid Social",
  display_ad: "Display Ad",
  unknown_channel: "Other",
};
const hqTrafficKeys = [
  "direct",
  "mail",
  "referral",
  "search_organic",
  "social_organic",
];
function WebTrafficByChannelChart({
  trafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer

  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("quarterYear");

  if (!trafficData) return null;
  function convertToChannelChartData(
    trafficData,
    type = "traffic_by_channel",
    timescale
  ) {
    let relevant_keys;
    if (type === "traffic_by_channel") {
      relevant_keys = [
        "direct",
        "mail",
        "referral",
        "search_organic",
        "social_organic",
        "search_paid",
        "social_paid",
        "display_ad",
        "unknown_channel",
      ];
    } else if (type === "traffic_by_device") {
      relevant_keys = ["mobile_visits", "desktop_visits"];
    } else if (type === "users_by_device") {
      relevant_keys = ["mobile_users", "desktop_users"];
    } else if (type === "traffic_by_organic_paid") {
      relevant_keys = [
        "search_organic",
        "social_organic",
        "search_paid",
        "social_paid",
      ];
    } else {
      relevant_keys = [
        "search_organic",
        "social_organic",
        "search_paid",
        "social_paid",
      ];
    }

    const aggData = relevant_keys.reduce((acc, key) => {
      acc[displayedKeyMap[key]] = aggregateData(
        trafficData,
        key,
        "sum",
        timescale
      );
      return acc;
    }, {});

    // aggData: {direct: {time_key: output_key}, mail: {time_key: output_key}, ...}
    const firstChannelData = aggData[displayedKeyMap[relevant_keys[0]]]; // use to extract timescale
    const percentAggData = normalizeStackedAggData(aggData);
    console.log("percentAggData", percentAggData);
    const chartData = {
      labels: Object.keys(firstChannelData),
      datasets: relevant_keys.map((key) => ({
        data: Object.values(percentAggData[displayedKeyMap[key]]).map((x) =>
          Number(roundPeNumbers(x))
        ),
        borderWidth: 1,
        label: displayedKeyMap[key],
      })),
    };
    // chartData.datasets = convertStackedChartDataToPercent(chartData.datasets); // convert to percent so bars add to 100%

    let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

    const cutoffIndex = 0;

    // Initialize an array to hold the sum of values for hq trafficeach time scale [0]
    const hqTrafficData = Array(Object.keys(firstChannelData).length).fill(0);
    // Sum up the values for each quarter
    relevant_keys.forEach((key) => {
      if (!hqTrafficKeys.includes(key)) return; // Skip if not hq traffic
      const channelData = percentAggData[displayedKeyMap[key]]; // Get the data for the channel
      Object.keys(channelData).forEach((quarter, ind) => {
        hqTrafficData[ind] += channelData[quarter]; // Sum up the values
      });
    });

    const hqTrafficRow = {
      data: hqTrafficData,
      label: "HQ Traffic",
    };
    const totalTrafficRow = {
      data: Array(tableLabels.length).fill(100),
      label: "Total Traffic",
    }; // denotes 100%

    const tableData = {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      tableDatasets: [
        ...chartData["datasets"].slice(0, hqTrafficKeys.length),
        hqTrafficRow,
        ...chartData["datasets"].slice(hqTrafficKeys.length),
        totalTrafficRow,
      ],
      topBorderedRows: [hqTrafficRow.label, totalTrafficRow.label],
      highlightedRows: {
        Direct: "bg-primaryLight",
        [hqTrafficRow.label]: "bg-customGray-75",
        [totalTrafficRow.label]: "bg-customGray-75",
      },
    };
    return { chartData: chartData, tableData: tableData };
  }

  function convertToChartData(data, displayedLabel) {
    // input: {time_key: output_key}
    let { labels, values, tableHeaders, tableLabels, growthPercentages } =
      getTableInfo(data);
    const cutoffIndex = findInsertIndex(
      labels.map((x) => convertLabelToDate(x)),
      cutOffDate,
      "left"
    );
    const chartData = {
      labels: labels.slice(cutoffIndex),
      datasets: [
        {
          label: displayedLabel + " (M)",
          data: values
            .map((item) => (item == null ? "--" : (item / 1e6).toFixed(1)))
            .slice(cutoffIndex),
          backgroundColor: "rgba(0, 154, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    const tableData = {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      tableDatasets: [
        ...chartData["datasets"],
        {
          label: "% YoY Growth",
          data: growthPercentages.slice(cutoffIndex),
        },
      ],
    };
    return { chartData: chartData, tableData: tableData };
  }

  const yearTrafficGraph = (
    <GenericBarAndTable
      data={convertToChartData(
        aggregateData(trafficData, "visits", "sum", "year"),
        "Visits"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={roundPeNumbers}
    />
  );

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        trafficByChannelTimescale
      )}
      title={"Total Visits by Channel (%)"}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={CHARTS.trafficByChannel}
      rawChartData={trafficData}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
    ></GenericStackedBar>
  );

  switch (selectedChart) {
    case CHARTS.trafficByChannel:
      return trafficByChannel;

    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Quality Over Time
            </p>
            <div className="group inline-flex items-center hover:cursor-pointer hover:text-primary">
              <Image
                src="/assets/downloadInactive.svg"
                className="w-5 h-5 object-contain opacity-50 group-hover:hidden"
                width={256}
                height={256}
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-5 h-5 object-contain hidden group-hover:block"
                width={256}
                height={256}
              />
            </div>
          </div>
          <div className="h-fit mb-4">
            <TwoColumnView
              quarterGraph={trafficByChannel}
              yearGraph={yearTrafficGraph}
            />
          </div>
        </div>
      );
  }
}

export default WebTrafficByChannelChart;
