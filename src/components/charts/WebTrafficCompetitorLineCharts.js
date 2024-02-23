import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToLineChartData } from "../../utils/ChartUtils";
import GenericLine from "./templates/GenericLine";
import Image from "next/image";

function WebTrafficCompetitorLineCharts({
  multiCompanyTrafficData,
  country,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [timescale, setTimeScale] = useState("quarterYear");
  if (!multiCompanyTrafficData) return null;

  const trafficGrowth = (
    <GenericLine
      data={convertToLineChartData(
        multiCompanyTrafficData,
        timescale,
        cutOffDate,
        "visits"
      )}
      title={"Visits Growth"}
      showDataLabels={timescale === "quarterYear"}
      timescale={timescale}
      setTimescale={setTimeScale}
      // selectedChart={CHARTS.trafficByChannel}
      rawChartData={multiCompanyTrafficData}
      formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
      location={country}
    ></GenericLine>
  );
  const yearTrafficGrowth = (
    <GenericLine
      data={convertToLineChartData(
        multiCompanyTrafficData,
        "year",
        cutOffDate,
        "visits"
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
