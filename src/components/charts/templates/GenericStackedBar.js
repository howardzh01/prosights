import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.unregister(ChartDataLabels);
function StackedBarChart({ data, title = undefined, showDataLabels = true }) {
  // Normailize values to sum to 100 so bars have equal height
  const totals = data.datasets.reduce((acc, curArr) => {
    curArr.data.forEach((value, index) => {
      acc[index] = (acc[index] || 0) + (value || 0);
    });
    return acc;
  }, []);
  data.datasets.forEach((dataset) => {
    dataset.data = dataset.data.map((value, i) =>
      (((value || 0) / totals[i]) * 100).toFixed(1)
    );
  });
  //   console.log("normalized", data);

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        align: "start", // Aligns title to the left
        position: "top", // Positions title at the top
      },
      legend: {
        display: true, // Hides the legend
        labels: {
          boxWidth: 12, // Set the width of the color box next to the legend text
          // ... other label options
        },
      },
      //   tooltip: {
      //     enabled: false, // Hides the tooltip
      //   },
      datalabels: {
        display: showDataLabels,
        // anchor: "end",
        // align: "top",
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
        stacked: true,
      },
      y: {
        display: false, // Hides the y-axis
        grid: {
          display: false, // Hides y-axis gridlines
        },
        stacked: true,
        max: 102,
      },
    },

    // maintainAspectRatio: false,
    // responsive: true,
    // other options...
  };
  return <Bar data={data} options={options} />;
}

export default StackedBarChart;
