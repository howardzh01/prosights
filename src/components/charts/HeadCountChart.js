import { useState, useEffect } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import ChartModal from "../ChartModal";

function HeadCountChart({ user, companyName, headCountData }) {
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
      showDataLabels={timescale === "quarterYear"}
      timescale={timescale}
      setTimescale={setTimescale}
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
    <div className="">
      <TwoColumnView
        titleId="employeeCount"
        title={"Employee Count"}
        quarterGraph={quarterHeadCountGraph}
        yearGraph={yearHeadCountGraph}
      ></TwoColumnView>
    </div>
  );
}

export default HeadCountChart;
