import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
Chart.register(ChartDataLabels);

function GenericBar({
  chartData,
  title = undefined,
  showDataLabels = true,
  showTimescaleButtons = true,
  timescale,
  setTimescale,
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
        // TODO: can make this into component as it is reused in GenericStackedBar
        <div className="flex items-center gap-1 self-end">
          <button
            type="button"
            disabled={timescale === "month"}
            onClick={() => setTimescale("month")}
          >
            <MinusCircleIcon
              className={`w-6 h-6 ${
                timescale === "month"
                  ? "text-customGray-200"
                  : "text-customGray-800"
              }`}
            />
          </button>
          <button
            type="button"
            disabled={timescale === "quarterYear"}
            onClick={() => setTimescale("quarterYear")}
          >
            <PlusCircleIcon
              className={`w-6 h-6 ${
                timescale === "quarterYear"
                  ? "text-customGray-200"
                  : "text-customGray-800"
              }`}
            />
          </button>
        </div>
      )}

      <div>{chartData && <Bar data={chartData} options={options}></Bar>}</div>
    </div>
  );
}

export default GenericBar;
