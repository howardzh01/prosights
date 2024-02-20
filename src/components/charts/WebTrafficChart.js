import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { aggregateData, roundPeNumbers } from "../../utils/Utils";
import { convertToGrowthChartData } from "../../utils/ChartUtils";
import { CHARTS } from "../../constants";

function WebTrafficChart({
  trafficData,
  country,
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
      location={country}
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
      selectedChart={CHARTS.trafficActiveUsers}
      // showTimescaleButtons={false}
      rawChartData={trafficData}
      showModalButtons={false}
      formatChartLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
      location={country}
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
      return customTrafficGraph;
    case CHARTS.trafficActiveUsers:
      return (
        <TwoColumnView
          quarterGraph={customUserGraph}
          yearGraph={yearUserGraph}
        />
      );
    // if no selected chart, return all charts
    default:
      return (
        <div>
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
