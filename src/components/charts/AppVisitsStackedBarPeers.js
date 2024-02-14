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

function AppVisitsStackedBarPeers({
  appDataDic,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  console.log(appDataDic);
  const multiCompanyAppData = Object.keys(appDataDic).reduce(
    (acc, companyName) => {
      acc[companyName] = appDataDic[companyName]["app_performance"];
      return acc;
    },
    {}
  );
  console.log(multiCompanyAppData);

  const [appByChannelTimescale, setAppByChannelTimescale] =
    useState("quarterYear");
  const ouputKey = "est_average_active_users";
  if (!multiCompanyAppData) return null;
  function convertToChannelChartData(appData, timescale) {
    const companyNames = Object.keys(appData);
    const aggData = companyNames.reduce((acc, key) => {
      acc[key] = aggregateData(appData[key], ouputKey, "sum", timescale);
      return acc;
    }, {});
    console.log("aggData", aggData);

    // aggData: {direct: {time_key: output_key}, mail: {time_key: output_key}, ...}
    const firstChannelData = aggData[companyNames[0]]; // use to extract timescale
    const percentAggData = normalizeStackedAggData(aggData);
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

  const appByChannel = (
    <GenericStackedBar
      data={convertToChannelChartData(
        multiCompanyAppData,
        appByChannelTimescale
      )}
      title={"Average App MAU Market Share (%)"}
      showDataLabels={appByChannelTimescale === "quarterYear"}
      timescale={appByChannelTimescale}
      setTimescale={setAppByChannelTimescale}
      selectedChart={CHARTS.appByChannel}
      rawChartData={multiCompanyAppData}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
    ></GenericStackedBar>
  );
  const yearAppByChannelGraph = (
    <GenericStackedBar
      data={convertToChannelChartData(multiCompanyAppData, "year")}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => roundPeNumbers(x) + "%"}
      displayLegend={false}
    ></GenericStackedBar>
  );

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
          quarterGraph={appByChannel}
          yearGraph={yearAppByChannelGraph}
        />
      </div>
    </div>
  );
}

export default AppVisitsStackedBarPeers;
