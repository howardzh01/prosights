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

function WebTrafficStackedBarPeers({
  multiCompanyTrafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("quarterYear");
  const ouputKey = "visits";
  if (!multiCompanyTrafficData) return null;
  function convertToChannelChartData(trafficData, timescale) {
    const companyNames = Object.keys(trafficData);
    const aggData = companyNames.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData[key], ouputKey, "sum", timescale);
      return acc;
    }, {});

    // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}
    const firstChannelData = aggData[companyNames[0]]; // use to extract timescale
    const percentAggData = normalizeStackedAggData(aggData);
    // console.log("percentAggData", percentAggData);
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
      topBorderedRows: [],
      highlightedRows: {},
    };
    return { chartData: chartData, tableData: tableData };
  }

  const trafficByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        multiCompanyTrafficData,
        trafficByChannelTimescale
      )}
      title={"Total Visits Market Share (%)"}
      showDataLabels={trafficByChannelTimescale === "quarterYear"}
      timescale={trafficByChannelTimescale}
      setTimescale={setTrafficByChannelTimescale}
      selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyTrafficData}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
    ></GenericStackedBar>
  );
  const yearTrafficByChannelGraph = (
    <GenericStackedBar
      data={convertToChannelChartData(multiCompanyTrafficData, "year")}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      displayLegend={false}
    ></GenericStackedBar>
  );

  switch (selectedChart) {
    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">
              Market Share vs. Peers
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

export default WebTrafficStackedBarPeers;
