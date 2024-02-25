import React from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { isColorLight, rgbToComponents } from "../../../utils/Utils.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GenericLocationDisplay from "./GenericLocationDisplay.js";
import GenericTimeScale from "./GenericTimeScale.js";
Chart.register(ChartDataLabels);

function GenericDoughnut({
  chartData,
  title = undefined,
  info = "",
  country,
  lastTwelveMonthsView = true,
  showModalButtons = false,
  selectedChart,
  rawChartData,
}) {
  const options = {
    plugins: {
      chartJSColorPlugin: false,
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          color: "#585F70",
        },
      },
      datalabels: {
        display: true,
        color: (context) => {
          // Get the background color of the current segment
          const backgroundColor =
            typeof context.dataset.backgroundColor === "string"
              ? context.dataset.backgroundColor
              : context.dataset.backgroundColor[context.dataIndex];
          // Convert the color to its RGB components
          const [r, g, b] = rgbToComponents(backgroundColor);
          // Set the color based on the luminance
          return isColorLight(r, g, b) ? "#242931" : "white";
        },
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (acc, item) => acc + item,
            0
          );
          const percentage = (value / total) * 100;
          // If the percentage is too small, don't display it
          if (percentage < 5) {
            return null; // This will hide the label
          } else {
            return `${percentage.toFixed(0)}%`; // Round to nearest whole number
          }
        },
        labels: {
          title: {
            font: {
              size: "11", // Adjust the font size to make sure it fits
            },
          },
        },
        anchor: "center",
        align: "center",
        textAlign: "center",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    devicePixelRatio: 2,
    cutout: "50%", // Adjust the cutout percentage to create the doughnut thickness you want
  };

  return (
    <div className="mt-1">
      {
        <GenericTimeScale
          title={title}
          info={info}
          showModalButtons={showModalButtons}
          rawChartData={rawChartData}
          selectedChart={selectedChart}
        />
      }
      {
        <div className="mt-3 mb-8">
          <GenericLocationDisplay
            location={country}
            lastTwelveMonthsView={lastTwelveMonthsView}
          />
        </div>
      }
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}

export default GenericDoughnut;
