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
