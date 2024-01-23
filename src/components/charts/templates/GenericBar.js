import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GenericTimeScale from "./GenericTimeScale";
Chart.register(ChartDataLabels);
import GenericTable from "./GenericTable";
import { formatMoney } from "../../../utils/Utils";

function GenericBar({
  barChartData,
  title = undefined,
  showDataLabels = true,
  showTimescaleButtons = true,
  showModalButtons = true,
  showTable = true,
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
  formatLabelFunction = (x) => x,
  scrollStart = "left",
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
        // formatter: Math.round,
        formatter: function (value, context) {
          return formatLabelFunction(Math.round(value));
        },
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
        {barChartData && <Bar data={barChartData} options={options} />}
      </div>

      {showTable && (
        <div>
          {/* Default to use barChartData if tableChartData is undefined */}
          <GenericTable chartData={barChartData} scrollStart={scrollStart} />
        </div>
      )}
    </div>
  );
}

export default GenericBar;
