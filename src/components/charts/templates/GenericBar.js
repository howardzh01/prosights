import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GenericTimeScale from "./GenericTimeScale";
Chart.register(ChartDataLabels);
import GenericTable from "./GenericTable";

function GenericBar({
  chartData,
  title = undefined,
  showDataLabels = true,
  showTimescaleButtons = true,
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
}) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        align: "start", // Aligns title to the left
        position: "top", // Positions title at the top
      },
      legend: {
        display: false, // Hides the legend
      },
      //   tooltip: {
      //     enabled: false, // Hides the tooltip
      //   },
      datalabels: {
        display: showDataLabels,
        anchor: "end",
        align: "top",
        formatter: Math.round,
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hides x-axis gridlines
        },
      },
      // TODO: maybe display y-axis if timeline === "month" as data labels are turned off on monthly
      y: {
        display: false, // Hides the y-axis
        grid: {
          display: false, // Hides y-axis gridlines
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    // other options...
  };

  return (
    <div className="flex flex-col">
      {showTimescaleButtons && (
        <GenericTimeScale
          timescale={timescale}
          setTimescale={setTimescale}
          selectedChart={selectedChart}
          rawChartData={rawChartData}
        ></GenericTimeScale>
      )}

      <div>{chartData && <Bar data={chartData} options={options}></Bar>}</div>
      <div>
        {chartData && <GenericTable chartData={chartData}></GenericTable>}
      </div>
    </div>
  );
}

export default GenericBar;
