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

function WebTrafficCompetitorLineCharts({
  multiCompanyTrafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [timescale, setTimeScale] = useState("quarterYear");
  const ouputKey = "visits";
  if (!multiCompanyTrafficData) return null;

  function convertToLineChartData(trafficData, timescale) {
    const companyNames = Object.keys(trafficData);
    const aggData = companyNames.reduce((acc, key) => {
      acc[key] = aggregateData(trafficData[key], ouputKey, "sum", timescale);
      return acc;
    }, {});

    // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}

    const firstCompanyData = aggData[companyNames[0]]; // use to extract timescale
    const growthAggData = companyNames.reduce((acc, key) => {
      acc[key] = convertToGrowthData(aggData[key], "number");
      return acc;
    }, {});
    const chartData = {
      labels: Object.keys(firstCompanyData),
      datasets: Object.keys(aggData).map((key) => ({
        data: Object.values(growthAggData[key]).map(
          (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
        ),
        borderWidth: 2,
        label: key,
      })),
    };

    let { tableHeaders, tableLabels } = getTableInfo(firstCompanyData);

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

  const trafficGrowth = (
    <GenericLine
      data={convertToLineChartData(multiCompanyTrafficData, timescale)}
      title={"Visits Growth"}
      showDataLabels={timescale === "quarterYear"}
      timescale={timescale}
      setTimescale={setTimeScale}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyTrafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
    ></GenericLine>
  );
  const yearTrafficGrowth = (
    <GenericLine
      data={convertToLineChartData(multiCompanyTrafficData, "year")}
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

export default WebTrafficCompetitorLineCharts;
