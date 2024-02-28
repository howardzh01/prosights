import { useState } from "react";
import {
  aggregateData,
  formatMoney,
  roundPeNumbers,
  formatNumberToAbbreviation,
} from "../../utils/Utils";
import GenericBarAndTable from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { convertToHeadcountChartData } from "../../utils/ChartUtils";
import { INFO_HOVERS } from "../../constants";

function HeadCountChart({ headCountData, cutOffDate = new Date("2019") }) {
  const [timescale, setTimescale] = useState("quarterYear");

  if (!headCountData) return null;

  const customChartData = convertToHeadcountChartData(
    aggregateData(headCountData, "headcount", "last", timescale),
    "Headcount",
    cutOffDate
  );

  const yearChartData = convertToHeadcountChartData(
    aggregateData(headCountData, "headcount", "last", "year"),
    "Headcount",
    cutOffDate
  );

  const quarterHeadCountGraph = (
    <GenericBarAndTable
      data={customChartData}
      info={INFO_HOVERS.SUMMARY.EMPLOYEE_HEADCOUNT}
      title={"Total Headcount"}
      showDataLabels={timescale !== "month"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      rawChartData={headCountData}
      showModalButtons={false}
      formatChartLabelFunction={formatNumberToAbbreviation}
      formatTableDataFunction={roundPeNumbers}
      location="Worldwide"
    />
  );

  const yearHeadCountGraph = (
    <GenericBarAndTable
      data={yearChartData}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
      formatChartLabelFunction={formatNumberToAbbreviation}
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
