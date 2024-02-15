import { Line } from "react-chartjs-2";
import GenericTimeScale from "./GenericTimeScale.js";
import { isColorLight, rgbToComponents } from "../../../utils/Utils.js";
import GenericTable from "./GenericTable.js";
import Chart from "chart.js/auto";
import { CHARTJS_COLOR_PLUGIN } from "../../../constants.js";
Chart.register(CHARTJS_COLOR_PLUGIN);
// import { Colors } from "chart.js";

function GenericLineChart({
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
  displayLegend = true,
}) {
  const { chartData, tableData } = data;
  const options = {
    elements: {
      line: {
        tension: 0.4, // Adjust this value for smoothness (0 for straight lines)
        borderColor: function (context) {
          return context.dataset.backgroundColor;
        }, // Use any color you like
      },
      point: {
        radius: 0, // Set to 0 to remove points
      },
    },
    plugins: {
      title: {
        display: false,
        // text: title,
        align: "start", // Aligns title to the left
        position: "top", // Positions title at the top
      },
      legend: {
        display: displayLegend,
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
      tooltip: {
        enabled: false, // Hides the tooltip
      },

      datalabels: {
        display: false,
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
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return value > 0
              ? value + "%"
              : value < 0
              ? `(${-1 * value}%)`
              : "--";
          },
          // Set the minimum and maximum values explicitly if needed
          // min: -100, // Minimum value for y-axis
          // max: 100, // Maximum value for y-axis
        },
      },
    },

    maintainAspectRatio: false,
    responsive: true,

    // other options...
  };

  const legendSpacingPlugin = {
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
    <div className="flex flex-col h-full w-full justify-end">
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
        <Line
          data={chartData}
          options={options}
          plugins={[legendSpacingPlugin]}
        />
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

export default GenericLineChart;
