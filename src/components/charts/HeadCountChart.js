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
      title={"Total Employee (#)"}
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
    <div>
      <h2 id="employeeCount" className="text-2xl font-bold">
        Employee Count
      </h2>
      <TwoColumnView
        quarterGraph={quarterHeadCountGraph}
        yearGraph={yearHeadCountGraph}
      ></TwoColumnView>
    </div>
  );
}

export default HeadCountChart;
