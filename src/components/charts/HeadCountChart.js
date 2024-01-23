import { useState } from "react";
import {
  aggregateData,
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  formatMoney,
  roundPeNumbers,
} from "../../utils/Utils";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { CHARTS } from "../../constants";

function HeadCountChart({ headCountData, cutOffDate = new Date("2019") }) {
  const [timescale, setTimescale] = useState("quarterYear");

  if (!headCountData) return null;

  function convertToChartData(data) {
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
          label: "HeadCount",
          data: values
            .map((item) => (item == null ? "--" : item))
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

  const customChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", timescale)
  );

  const yearChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", "year")
  );

  const quarterHeadCountGraph = (
    <GenericBar
      barChartData={customChartData}
      title={"Total Headcount"}
      showDataLabels={timescale !== "month"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      rawChartData={headCountData}
      showModalButtons={false}
      formatLabelFunction={formatMoney}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const yearHeadCountGraph = (
    <GenericBar
      barChartData={yearChartData}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatLabelFunction={formatMoney}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  return (
    <div className="flex flex-col">
      {/* <p
        id="employeeCount"
        className="text-base font-semibold text-gray-800 mb-3"
      >
        Employees
      </p> */}
      <TwoColumnView
        quarterGraph={quarterHeadCountGraph}
        yearGraph={yearHeadCountGraph}
      />
    </div>
  );
}

export default HeadCountChart;
