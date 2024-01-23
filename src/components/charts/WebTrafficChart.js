import { useState, useEffect } from "react";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import ThreeColumnView from "./templates/ThreeColumnView";
import {
  aggregateData,
  findInsertIndex,
  getTableInfo,
  convertLabelToDate,
  roundPeNumbers,
} from "../../utils/Utils";
import GenericStackedBar from "./templates/GenericStackedBar";
import { CHARTS } from "../../constants";

function WebTrafficChart({
  trafficData,
  selectedChart = null,
  cutOffDate = new Date("2019"),
}) {
  // TODO: make this more compact later - probably 1 useState with an object containing all timescale states, or useReducer
  const [trafficTimescale, setTrafficTimescale] = useState("quarterYear");
  const [mauTimescale, setMauTimescale] = useState("quarterYear");
  const [trafficByChannelTimescale, setTrafficByChannelTimescale] =
    useState("year");
  const [trafficByDeviceTimescale, setTrafficByDeviceTimescale] =
    useState("year");
  const [usersByDeviceTimescale, setUsersByDeviceTimescale] = useState("year");
  const [trafficByOrganicVsPaidTimescale, setTrafficByOrganicVsPaidTimescale] =
    useState("year");

  if (!trafficData) return null;
  console.log(
    Object.keys(trafficData).map((key) => {
      let date = new Date(key);
      let year = date.getUTCFullYear().toString().substr(-2);
      let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      return [`${month}-${year}`, trafficData[key]];
    })
  );
  function convertToChartData(data, displayedLabel) {
    // input: {time_key: output_key}
    let { labels, values, tableHeaders, tableLabels, growthPercentages } =
      getTableInfo(data);
    const cutoffIndex = findInsertIndex(
      labels.map((x) => convertLabelToDate(x)),
      cutOffDate,
      "left"
    );
    return {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      labels: labels.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      datasets: [
        {
          label: displayedLabel + " (M)",
          data: values
            .map((item) => (item == null ? "--" : (item / 1e6).toFixed(1)))
            .slice(cutoffIndex),
          backgroundColor: "rgba(0, 154, 255, 1)",
          borderWidth: 1,
        },
      ],
      tableDatasets: [
        {
          label: "% YoY Growth",
          data: growthPercentages.slice(cutoffIndex),
        },
      ],
    };
  }

  const customTrafficGraph = (
    <GenericBar
      barChartData={convertToChartData(
        aggregateData(trafficData, "visits", "sum", trafficTimescale),
        "Visits"
      )}
      title={"Total Visits (M)"}
      showDataLabels={trafficTimescale !== "month"}
      timescale={trafficTimescale}
      setTimescale={setTrafficTimescale}
      selectedChart={CHARTS.traffic}
      rawChartData={trafficData}
      showModalButtons={false}
      formatLabelFunction={roundPeNumbers}
    />
  );
  const yearTrafficGraph = (
    <GenericBar
      barChartData={convertToChartData(
        aggregateData(trafficData, "visits", "sum", "year"),
        "Visits"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatLabelFunction={roundPeNumbers}
    />
  );

  const customUserGraph = (
    <GenericBar
      barChartData={convertToChartData(
        aggregateData(trafficData, "users", "mean", mauTimescale),
        "Users"
      )}
      title={"Web Users (M)"}
      showDataLabels={mauTimescale !== "month"}
      timescale={mauTimescale}
      setTimescale={setMauTimescale}
      selectedChart={CHARTS.mau}
      // showTimescaleButtons={false}
      rawChartData={trafficData}
      showModalButtons={false}
      formatLabelFunction={roundPeNumbers}
    />
  );
  const yearUserGraph = (
    <GenericBar
      barChartData={convertToChartData(
        aggregateData(trafficData, "users", "mean", "year"),
        "Users"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatLabelFunction={roundPeNumbers}
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
          <p className="text-base font-semibold text-gray-800 mb-3">
            Traffic Growth
          </p>
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
