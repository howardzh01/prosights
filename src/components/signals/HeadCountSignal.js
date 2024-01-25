import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "../charts/templates/GenericBar";
// import TwoColumnView from "../charts/templates/TwoColumnView";
import { CHARTS } from "../../constants";
import { formatMoney } from "../../utils/Utils";

function HeadCountSignal({ headCountData, startCutoff = new Date("2019") }) {
  const [timescale, setTimescale] = useState("year");

  if (!headCountData) return null;

  function convertToChartData(data) {
    // input: {time_key: output_key}
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(
        (data) => new Date(data[0]) >= new Date(startCutoff)
      )
    );
    return {
      labels: Object.keys(filteredData),
      datasets: [
        {
          // label: "Total Employee (#)",
          data: Object.values(filteredData),
          backgroundColor: "rgba(0, 154, 255, 1)",
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 0,
          // barThickness: 24,
          barPercentage: 0.7,
        },
      ],
    };
  }

  const yearHeadCountGraph = (
    <GenericBar
      barChartData={convertToChartData(
        aggregateData(headCountData, "headcount", "last", timescale)
      )}
      title={"Headcount"}
      showDataLabels={timescale === "year"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      showTable={false}
      rawChartData={headCountData}
      showTimescaleButtons={false}
      formatLabelFunction={formatMoney}
      location={"Global"}
    />
  );

  return yearHeadCountGraph;
}

export default HeadCountSignal;
