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
  showModalButtons = true,
  showTable = true,
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
}) {
  const options = {
    plugins: {
      title: {
        display: true,
        // text: title,
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
          weight: "light",
        },
        color: "#828BA4",
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
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    responsive: true,
    // other options...
  };

  return (
    <div className="flex flex-col h-full w-full">
      {(showTimescaleButtons || showModalButtons) && (
        <GenericTimeScale
          timescale={timescale}
          setTimescale={setTimescale}
          selectedChart={selectedChart}
          rawChartData={rawChartData}
          title={title}
          showTimescaleButtons={showTimescaleButtons}
          showModalButtons={showModalButtons}
        />
      )}

      <div className="h-full w-full">
        {chartData && <Bar data={chartData} options={options} />}
      </div>

      {showTable && (
        <div>{chartData && <GenericTable chartData={chartData} />}</div>
      )}
    </div>
  );
}

export default GenericBar;
