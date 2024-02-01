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
const paidTrafficKeys = ["search_paid", "social_paid", "display_ad"];
const paidTrafficRowName = "Paid Visits";
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
    let relevant_keys,
      condensePaidKeys = false;
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
      condensePaidKeys = true;
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
      const displayedKey =
        condensePaidKeys && paidTrafficKeys.includes(key)
          ? paidTrafficRowName
          : displayedKeyMap[key];

      acc[displayedKey] = aggregateData(trafficData, key, "sum", timescale);
      return acc;
    }, {});

    // aggData: {direct: {time_key: output_key}, mail: {time_key: output_key}, ...}
    const firstChannelData = aggData[displayedKeyMap[relevant_keys[0]]]; // use to extract timescale
    const percentAggData = normalizeStackedAggData(aggData);
    console.log("percentAggData", percentAggData);
    const chartData = {
      labels: Object.keys(firstChannelData),
      datasets: Object.keys(aggData).map((key) => ({
        data: Object.values(percentAggData[key]).map((x) =>
          Number(roundPeNumbers(x))
        ),
        borderWidth: 1,
        label: key,
      })),
    };
    // chartData.datasets = convertStackedChartDataToPercent(chartData.datasets); // convert to percent so bars add to 100%

    let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

    const cutoffIndex = 0;

    const tableData = {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      tableDatasets: [...chartData["datasets"]],
      topBorderedRows: [paidTrafficRowName],
      highlightedRows: {
        Direct: "bg-primaryLight",
        [paidTrafficRowName]: "bg-customGray-75",
        // [totalTrafficRow.label]: "bg-customGray-75",
      },
    };
    return { chartData: chartData, tableData: tableData };
  }

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
  const yearTrafficByChannelGraph = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        "year"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
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
              yearGraph={yearTrafficByChannelGraph}
            />
          </div>
        </div>
      );
  }
}

export default WebTrafficByChannelChart;
