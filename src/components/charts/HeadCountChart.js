import { useState } from "react";
import { aggregateData } from "../../utils/Utils";
import GenericBar from "./templates/GenericBar";
import TwoColumnView from "./templates/TwoColumnView";
import { CHARTS } from "../../constants";

function HeadCountChart({ headCountData }) {
  const [timescale, setTimescale] = useState("quarterYear");

  if (!headCountData) return null;

  function convertToChartData(data) {
    const labels = Object.keys(data);
    let headers = [];
    let formattedLabels = [];
    let headcounts = Object.values(data);
    let growthPercentages = [];

    // Regular expressions to identify label formats
    const monthlyRegex = /^[A-Za-z]+/;
    const quarterlyRegex = /^[1-4]Q/;
    const yearlyRegex = /^\d{4}$/;

    // Determine timescale based on the format of labels
    const isMonthly = labels.some((label) => monthlyRegex.test(label));
    const isQuarterly = labels.some((label) => quarterlyRegex.test(label));
    const isYearly = labels.some((label) => yearlyRegex.test(label));

    // Determine offset for growth calculation
    const offset = isYearly ? 1 : isMonthly ? 12 : isQuarterly ? 4 : 1; // Default to 1 if none match

    // Calculate the growth percentages
    for (let i = 0; i < headcounts.length; i++) {
      if (
        i < offset ||
        headcounts[i - offset] === 0 ||
        headcounts[i - offset] == null ||
        headcounts[i] == null
      ) {
        growthPercentages.push("—");
      } else {
        const growth =
          ((headcounts[i] - headcounts[i - offset]) / headcounts[i - offset]) *
          100;
        growthPercentages.push(`${Math.round(growth)}%`);
      }
    }

    // Process labels and headers
    const isAllAnnual = labels.every((label) => /^\d{4}$/.test(label));

    labels.forEach((label) => {
      const yearMatch = label.match(/\d{2,4}$/);
      const year = yearMatch
        ? yearMatch[0].length === 2
          ? "20" + yearMatch[0]
          : yearMatch[0]
        : undefined;

      if (isAllAnnual) {
        headers.push("Annual");
        formattedLabels.push(label);
      } else {
        headers.push(year || label);

        const quarterOrMonthMatch = label.match(/^[1-4]Q|^[A-Za-z]+/);
        if (quarterOrMonthMatch) {
          formattedLabels.push(quarterOrMonthMatch[0]);
        } else {
          formattedLabels.push(label);
        }
      }
    });

    return {
      headers: headers,
      originalLabels: labels,
      labels: formattedLabels,
      datasets: [
        {
          label: "Headcount",
          data: headcounts,
          backgroundColor: "rgba(0, 154, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "% YoY Growth",
          data: growthPercentages,
          // Add more styling as necessary
        },
      ],
    };
  }

  // function convertToChartData(data) {
  //   console.log("parsed data, ", data);
  //   // input: {time_key: output_key}
  //   return {
  //     labels: Object.keys(data),
  //     datasets: [
  //       {
  //         // label: "Total Employee (#)",
  //         data: Object.values(data),
  //         backgroundColor: "rgba(0, 154, 255, 1)",
  //         // backgroundColor: "rgba(75, 192, 192, 0.2)",
  //         // borderColor: "rgba(75, 192, 192, 1)",
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  // }

  const customChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", timescale)
  );

  const yearChartData = convertToChartData(
    aggregateData(headCountData, "headcount", "last", "year")
  );

  const quarterHeadCountGraph = (
    <GenericBar
      barChartData={{
        ...customChartData,
        labels: customChartData.originalLabels,
        datasets: customChartData.datasets.filter(
          (dataset) => dataset.label !== "% YoY Growth"
        ),
      }}
      tableChartData={customChartData}
      title={"Total Headcount"}
      showDataLabels={timescale !== "month"}
      timescale={timescale}
      setTimescale={setTimescale}
      selectedChart={CHARTS.employeeCount}
      rawChartData={headCountData}
      showModalButtons={false}
    />
  );

  const yearHeadCountGraph = (
    <GenericBar
      barChartData={{
        ...yearChartData,
        labels: yearChartData.originalLabels,
        datasets: yearChartData.datasets.filter(
          (dataset) => dataset.label !== "% YoY Growth"
        ),
      }}
      tableChartData={yearChartData}
      showTimescaleButtons={false}
      showModalButtons={false}
      scrollStart={"right"}
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
