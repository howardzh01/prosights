import { useState } from "react";
import {
  aggregateData,
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  formatMoney,
  roundPeNumbers,
} from "../../utils/Utils";
import GenericBarAndTable from "./templates/GenericBar";
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

    const chartData = {
      labels: labels.slice(cutoffIndex),
      datasets: [
        {
          label: "HeadCount",
          data: values
            .map((item) => (item == null ? "--" : item))
            .slice(cutoffIndex),
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

  const customChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", timescale)
  );

  const yearChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", "year")
  );

  const quarterHeadCountGraph = (
    <GenericBarAndTable
      data={customChartData}
      title={"Total Headcount"}
      showDataLabels={timescale !== "month"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      rawChartData={headCountData}
      showModalButtons={false}
      formatChartLabelFunction={formatMoney}
      formatTableDataFunction={roundPeNumbers}
    />
  );

  const yearHeadCountGraph = (
    <GenericBarAndTable
      data={yearChartData}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={formatMoney}
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
