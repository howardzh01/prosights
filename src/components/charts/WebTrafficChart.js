import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import { convertToGrowthChartData } from "../../utils/ChartUtils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";
import Image from "next/image";

function WebTrafficChart({
  trafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [trafficTimescale, setTrafficTimescale] = useState("quarterYear");
  const [mauTimescale, setMauTimescale] = useState("quarterYear");

  if (!trafficData) return null;
  // console.log(
  //   Object.keys(trafficData).map((key) => {
  //     let date = new Date(key);
  //     let year = date.getUTCFullYear().toString().substr(-2);
  //     let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  //     return [`${month}-${year}`, trafficData[key]];
  //   })
  // );

  const customTrafficGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(trafficData, "visits", "sum", trafficTimescale),
        "Visits",
        cutOffDate
      )}
      title={"Total Visits (M)"}
      showDataLabels={trafficTimescale !== "month"}
      timescale={trafficTimescale}
      setTimescale={setTrafficTimescale}
      selectedChart={CHARTS.traffic}
      rawChartData={trafficData}
      showModalButtons={false}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const yearTrafficGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(trafficData, "visits", "sum", "year"),
        "Visits",
        cutOffDate
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const customUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(trafficData, "users", "mean", mauTimescale),
        "Users",
        cutOffDate
      )}
      title={"Web Users (M)"}
      showDataLabels={mauTimescale !== "month"}
      timescale={mauTimescale}
      setTimescale={setMauTimescale}
      selectedChart={CHARTS.mau}
      // showTimescaleButtons={false}
      rawChartData={trafficData}
      showModalButtons={false}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );
  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToGrowthChartData(
        aggregateData(trafficData, "users", "mean", "year"),
        "Users",
        cutOffDate
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  switch (selectedChart) {
    case CHARTS.traffic:
      return yearTrafficGraph;
    case CHARTS.mau:
      return yearUserGraph;
    // if no selected chart, return all charts
    default:
      return (
        <div>
          <div className="flex flex-row items-center mb-3">
            <p className="text-lg font-semibold text-gray-800 mr-2">Growth</p>
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
              quarterGraph={customTrafficGraph}
              yearGraph={yearTrafficGraph}
            />
          </div>
          <div className="h-fit my-8">
            <TwoColumnView
              quarterGraph={customUserGraph}
              yearGraph={yearUserGraph}
            />
          </div>
        </div>
      );
  }
}

export default WebTrafficChart;
