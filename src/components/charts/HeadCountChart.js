import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { CHARTS } from "../../constants";

function HeadCountChart({ headCountData }) {
  const [timescale, setTimescale] = useState("quarterYear");

  if (!headCountData) return null;

  function convertToChartData(data) {
    // input: {time_key: output_key}
    return {
      labels: Object.keys(data),
      datasets: [
        {
          // label: "Total Employee (#)",
          data: Object.values(data),
          backgroundColor: "rgba(0, 154, 255, 1)",
          // backgroundColor: "rgba(75, 192, 192, 0.2)",
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }

  const quarterHeadCountGraph = (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", timescale)
      )}
      title={"Total Headcount"}
      showDataLabels={timescale !== "month"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      rawChartData={headCountData}
    />
  );

  const yearHeadCountGraph = (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", "year")
      )}
      showTimescaleButtons={false}
    />
  );

  return (
    <div className="flex flex-col">
      <p
        id="employeeCount"
        className="text-base font-semibold text-gray-800 mb-3"
      >
        Employees
      </p>
      <div className="px-6 py-4 rounded-lg drop-shadow-sm bg-white border border-customGray-50">
        <TwoColumnView
          quarterGraph={quarterHeadCountGraph}
          yearGraph={yearHeadCountGraph}
        />
      </div>
    </div>
  );
}

export default HeadCountChart;
