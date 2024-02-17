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
import { convertToLineChartData } from "../../utils/ChartUtils";
import GenericLine from "./templates/GenericLine";
import { CHARTS } from "../../constants";
import Image from "next/image";

function AppVisitsCompetitorLineChart({
  multiCompanyAppData,
  country,
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
  if (!multiCompanyAppData) return null;

  const trafficGrowth = (
    <GenericLine
      data={convertToLineChartData(
        multiCompanyAppPerformance,
        timescale,
        cutOffDate
      )}
      title={"Visits Growth"}
      showDataLabels={timescale === "quarterYear"}
      timescale={timescale}
      setTimescale={setTimeScale}
      location={country}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyAppData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
    ></GenericLine>
  );
  const yearTrafficGrowth = (
    <GenericLine
      data={convertToLineChartData(
        multiCompanyAppPerformance,
        "year",
        cutOffDate
      )}
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
                alt="Download Icon"
              />
              <Image
                src="/assets/downloadActive.svg"
                className="w-5 h-5 object-contain hidden group-hover:block"
                width={256}
                height={256}
                alt="Download Icon"
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
