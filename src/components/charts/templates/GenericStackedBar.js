import { Bar } from "react-chartjs-2";
import GenericTimeScale from "./GenericTimeScale";
import { isColorLight, rgbToComponents } from "../../../utils/Utils.js";
import GenericTable from "./GenericTable";
import Chart from "chart.js/auto";
import { CHARTJS_COLOR_PLUGIN } from "../../../constants";
Chart.register(CHARTJS_COLOR_PLUGIN);
// import { Colors } from "chart.js";

function StackedBarChart({
  data, // {chartData, tableData}
  showDataLabels = true,
  showTimescaleButtons = true,
  showModalButtons = false,
  showTable = true,
  title = undefined, // Timescale component from here on
  location = "",
  timescale,
  setTimescale,
  selectedChart,
  rawChartData,
  formatChartLabelFunction = (x) => x,
  formatTableDataFunction = (x) => x, //Table Options from here on
  scrollStart = "left",
  height = "h-84",
  legendPosition = "top",
}) {
  const { chartData, tableData } = data;
  //   console.log("normalized", data);

  const options = {
    plugins: {
      title: {
        display: false,
        // text: title,
        align: "start", // Aligns title to the left
        position: "top", // Positions title at the top
      },
      legend: {
        display: true, // Hides the legend
        position: legendPosition,
        labels: {
          boxHeight: 10, // Set circle height
          usePointStyle: true, // This changes the legend icons to circles
          padding: 16,
          // ... other label options
        },
        padding: {
          top: 10, // Adjust the top padding
          bottom: 40, // Adjust the bottom padding to push the graph down
        },
      },
      //   tooltip: {
      //     enabled: false, // Hides the tooltip
      //   },
      datalabels: {
        display: showDataLabels,
        formatter: (value, context) => {
          if (value < 5) {
            return null;
          } else {
            return `${Math.round(value)}%`;
          }
        },
        font: {
          weight: "bold",
        },
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hides x-axis gridlines
        },
        stacked: true,
      },
      // TODO: maybe display y-axis if timeline === "month" as data labels are turned off on monthly
      y: {
        display: false, // Change this to true to show the y-axis
        grid: {
          display: true, // Enables y-axis gridlines
        },
        border: { dash: [2, 1] },
        stacked: true,
        max: 100, // Set the maximum value of the y-axis to 100%
        ticks: {
          stepSize: 10, // Sets the step size between ticks to 10
          callback: function (value) {
            return value + "%"; // Appends a '%' sign after each tick value
          },
        },
      },
    },

    maintainAspectRatio: false,
    responsive: true,

    // other options...
  };

  const plugin = {
    id: "increase-legend-spacing",
    beforeInit(chart) {
      // Get reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // Change the height as suggested in another answers
        this.height += 10;
      };
    },
    colors: {
      enabled: false,
    },
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

      <div className={`${height}`}>
        <Bar data={chartData} options={options} plugins={[plugin]} />
      </div>
      {showTable && (
        <div>
          {/* Default to use data if tableChartData is undefined */}
          <GenericTable
            tableData={tableData}
            scrollStart={scrollStart}
            formatTableDataFunction={formatTableDataFunction}
          />
        </div>
      )}
    </div>
  );
}

export default StackedBarChart;
