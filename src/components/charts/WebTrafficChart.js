import { useState, useEffect } from "react";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import {
  aggregateData,
  findInsertIndex,
  getTableInfo,
  convertLabelToDate,
  roundPeNumbers,
} from "../../utils/Utils";
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
    const chartData = {
      labels: labels.slice(cutoffIndex),
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
    };

    const tableData = {
      tableHeaders: tableHeaders.slice(cutoffIndex),
      tableLabels: tableLabels.slice(cutoffIndex),
      tableDatasets: [
        ...chartData["datasets"],
        {
          label: "% YoY Growth",
          data: growthPercentages.slice(cutoffIndex),
        },
      ],
    };
    return { chartData: chartData, tableData: tableData };
  }
  const customTrafficGraph = (
    <GenericBarAndTable
      data={convertToChartData(
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
      formatTableDataFunction={roundPeNumbers}
    />
  );
  const yearTrafficGraph = (
    <GenericBarAndTable
      data={convertToChartData(
        aggregateData(trafficData, "visits", "sum", "year"),
        "Visits"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatLabelFunction={roundPeNumbers}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const customUserGraph = (
    <GenericBarAndTable
      data={convertToChartData(
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
      formatTableDataFunction={roundPeNumbers}
    />
  );
  const yearUserGraph = (
    <GenericBarAndTable
      data={convertToChartData(
        aggregateData(trafficData, "users", "mean", "year"),
        "Users"
      )}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatLabelFunction={roundPeNumbers}
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
