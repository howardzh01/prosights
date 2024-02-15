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
  convertToGrowthData,
} from "../../utils/Utils";
import GenericLine from "./templates/GenericLine";
import { CHARTS } from "../../constants";
import Image from "next/image";

function AppVisitsCompetitorLineChart({
  multiCompanyAppData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  if (!multiCompanyAppData) return null;
  const multiCompanyAppPerformance = Object.keys(multiCompanyAppData).reduce(
    (acc, companyName) => {
      if (multiCompanyAppData[companyName]) {
        acc[companyName] = multiCompanyAppData[companyName]["app_performance"];
      }
      return acc;
    },
    {}
  );
  if (
    !multiCompanyAppPerformance ||
    Object.keys(multiCompanyAppPerformance).length === 0
  )
    return null;
  const [timescale, setTimeScale] = useState("quarterYear");
  const ouputKey = "est_average_active_users";
  if (!multiCompanyAppData) return null;

  function convertToLineChartData(trafficData, timescale) {
    const companyNames = Object.keys(trafficData);
    const aggData = companyNames.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData[key], ouputKey, "mean", timescale);
      return acc;
    }, {});
    // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}

    const firstCompanyData = aggData[companyNames[0]]; // use to extract timescale
    const cutoffIndex = findInsertIndex(
      Object.keys(firstCompanyData).map((x) => convertLabelToDate(x)),
      cutOffDate,
      "left"
    );

    const growthAggData = companyNames.reduce((acc, key) => {
      acc[key] = convertToGrowthData(aggData[key], "number").slice(cutoffIndex);
      return acc;
    }, {});
    const chartData = {
      labels: Object.keys(firstCompanyData).slice(cutoffIndex),
      datasets: Object.keys(aggData).map((key) => ({
        data: Object.values(growthAggData[key]).map(
          (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
        ),
        borderWidth: 2,
        label: key,
      })),
    };

    let { tableHeaders, tableLabels } = getTableInfo(firstCompanyData);

    const tableData = {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      tableDatasets: [...chartData["datasets"]],
      topBorderedRows: [],
      highlightedRows: {},
    };
    return { chartData: chartData, tableData: tableData };
  }

  const trafficGrowth = (
    <GenericLine
      data={convertToLineChartData(multiCompanyAppPerformance, timescale)}
      title={"Visits Growth"}
      showDataLabels={timescale === "quarterYear"}
      timescale={timescale}
      setTimescale={setTimeScale}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyAppData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
    ></GenericLine>
  );
  const yearTrafficGrowth = (
    <GenericLine
      data={convertToLineChartData(multiCompanyAppPerformance, "year")}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
    ></GenericLine>
  );

  switch (selectedChart) {
    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-grxay-800 mr-2">
              Growth vs. Peers
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
              quarterGraph={trafficGrowth}
              yearGraph={yearTrafficGrowth}
            />
          </div>
        </div>
      );
  }
}

export default AppVisitsCompetitorLineChart;
