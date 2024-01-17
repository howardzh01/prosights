import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";

function HeadCountSignal({ headCountData }) {
  const [timescale, setTimescale] = useState("year");

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
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 0,
          barThickness: 24,
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
      // selectedChart={CHARTS.employeeCount}
      showTable={false}
      rawChartData={headCountData}
    />
  );

  const yearHeadCountGraph = (
    <GenericBar
      chartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", "year")
      )}
      showTable={false}
      showTimescaleButtons={false}
    />
  );

  return (
    <div>
      <h2 id="employeeCount" className="text-md font-semibold">
        Headcount
      </h2>
      {yearHeadCountGraph}
    </div>
  );
}

export default HeadCountSignal;
