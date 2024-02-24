import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBarAndTable from "../charts/templates/GenericBar";
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
    <GenericBarAndTable
      data={{
        chartData: convertToChartData(
          aggregateData(headCountData, "headcount", "last", timescale)
        ),
      }}
      title={"Headcount"}
      info={
        <span>
          <strong>Metric:</strong> Refers to the estimated number of a company’s
          full-time employees at the end of the period (e.g., 4Q23 = December
          2023). A visitor counts as any individual who visited the site at
          least once during the month.
          <br />
          <br />
          <strong>Data Methodology:</strong> CoreSignal sources its data solely
          from public sources such as LinkedIn, providing estimates on companies
          based on the assumption that LinkedIn accurately reflects full-time
          employee numbers. However, discrepancies occur when individuals list
          themselves employed by a company on LinkedIn, despite not being
          full-time, such as in cases of freelance contractors or unpaid
          contributors.
        </span>
      }
      showDataLabels={timescale === "year"}
      timescale={timescale}
      setTimescale={setTimescale}
      showModalButtons={true}
      selectedChart={CHARTS.employeeCount}
      showTable={false}
      rawChartData={headCountData}
      showTimescaleButtons={false}
      formatChartLabelFunction={formatMoney}
      location={"Worldwide"}
    />
  );

  return yearHeadCountGraph;
}

export default HeadCountSignal;
