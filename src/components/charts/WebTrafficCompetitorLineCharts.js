import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { roundPeNumbers } from "../../utils/Utils";
import { convertToLineChartData } from "../../utils/ChartUtils";
import GenericLine from "./templates/GenericLine";
import Image from "next/image";
import { INFO_HOVERS } from "../../constants";

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
    <div className="h-[26rem]">
      <GenericLine
        data={convertToLineChartData(
          multiCompanyTrafficData,
          timescale,
          cutOffDate,
          "visits"
        )}
        title={"Visits Growth"}
        info={INFO_HOVERS.TRAFFIC.GROWTH_VS_PEERS}
        showDataLabels={timescale === "quarterYear"}
        timescale={timescale}
        setTimescale={setTimeScale}
        // selectedChart={CHARTS.trafficByChannel}
        rawChartData={multiCompanyTrafficData}
        formatTableDataFunction={(x) => (x ? roundPeNumbers(x) + "%" : "--")}
        location={country}
      ></GenericLine>
    </div>
  );
  const yearTrafficGrowth = (
    <div className="h-[26rem]">
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
    </div>
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
