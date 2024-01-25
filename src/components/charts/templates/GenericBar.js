import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GenericTimeScale from "./GenericTimeScale";
Chart.register(ChartDataLabels);
import GenericTable from "./GenericTable";
import Image from "next/image";

function GenericBar({
  barChartData,
  title = undefined,
  showDataLabels = true,
  showTimescaleButtons = true,
  showModalButtons = true,
  showTable = true,
  location = "",
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
  formatLabelFunction = (x) => x,
  formatTableDataFunction = (x) => x,
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
          return formatLabelFunction(value);
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
    barPercentage: 0.9,
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

      {location && (
        <div className="flex flex-row mt-3">
          <Image
            src="/assets/globe.svg"
            alt="Company Logo"
            className="w-4 h-4 object-contain mr-1"
            width={128}
            height={128}
          />
          <p className="text-xs font-normal text-customGray-200">{location}</p>
        </div>
      )}

      <div className="h-full w-full">
        {barChartData && <Bar data={barChartData} options={options} />}
      </div>

      {showTable && (
        <div>
          {/* Default to use barChartData if tableChartData is undefined */}
          <GenericTable
            chartData={barChartData}
            scrollStart={scrollStart}
            formatDataFunction={formatTableDataFunction}
          />
        </div>
      )}
    </div>
  );
}

export default GenericBar;
