import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import {
  aggregateData,
  findInsertIndex,
  getTableInfo,
  convertLabelToDate,
  roundPeNumbers,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficByChannelChart({
  trafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer

  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("year");

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
        "social",
        "search",
        "referral",
        "display_ad",
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
      acc[key] = aggregateData(trafficData, key, "sum", timescale);
      return acc;
    }, {});

    return {
      labels: Object.keys(aggData[relevant_keys[0]]),
      datasets: relevant_keys.map((key) => ({
        data: Object.values(aggData[key]).map((number) => number / 1e6),
        borderWidth: 1,
        label: key,
      })),
    };
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
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        trafficData,
        "traffic_by_channel",
        trafficByChannelTimescale
      )}
      title={"% Share"}
      showDataLabels={false}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={CHARTS.trafficByChannel}
      rawChartData={trafficData}
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
            <p className="text-base font-semibold text-gray-800 mr-2">Growth</p>
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
