import {
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  aggregateData,
} from "./Utils";

export function convertToHeadcountChartData(
  data,
  displayedLabel = "HeadCount",
  cutOffDate
) {
  let { labels, values, tableHeaders, tableLabels, growthPercentages } =
    getTableInfo(data);
  const cutoffIndex = findInsertIndex(
    labels.map((x) => convertLabelToDate(x)),
    cutOffDate,
    "left"
  );

  const chartData = {
    labels: labels.slice(cutoffIndex),
    datasets: [
      {
        label: displayedLabel,
        data: values
          .map((item) => (item == null ? "--" : item))
          .slice(cutoffIndex),
      },
    ],
  };

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [
      ...chartData["datasets"],
      {
        label: "% YoY Growth",
        data: growthPercentages.slice(cutoffIndex),
      },
    ],
  };
  return { chartData: chartData, tableData: tableData };
}

export function convertToGrowthChartData(data, displayedLabel, dataCutoffDate) {
  // input: {time_key: output_key}
  let { labels, values, tableHeaders, tableLabels, growthPercentages } =
    getTableInfo(data);
  const cutoffIndex = findInsertIndex(
    labels.map((x) => convertLabelToDate(x)),
    dataCutoffDate,
    "left"
  );
  const chartData = {
    labels: labels.slice(cutoffIndex),
    datasets: [
      {
        label: displayedLabel + " (M)",
        data: values
          .map((item) => (item == null ? "--" : (item / 1e6).toFixed(1)))
          .slice(cutoffIndex),
      },
    ],
  };

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [
      ...chartData["datasets"],
      {
        label: "% YoY Growth",
        data: growthPercentages.slice(cutoffIndex),
      },
    ],
  };
  return { chartData: chartData, tableData: tableData };
}

function convertBarGraphToExcelFormat(
  data,
  outputKey,
  agg,
  displayedLabel,
  dataCutoffDate,
  dataConversionFunction
) {
  const timeFrames = ["month", "quarterYear", "year"];
  const chartData = Object.fromEntries(
    timeFrames.map((timeFrame) => [
      `${timeFrame}ChartData`,
      dataConversionFunction(
        aggregateData(data, outputKey, agg, timeFrame),
        displayedLabel,
        dataCutoffDate
      ),
    ])
  );
  const { monthChartData, quarterYearChartData, yearChartData } = chartData;

  const columnTitles = [
    "Date",
    ...monthChartData.tableData.tableDatasets.map((dataset) => dataset.label),
  ];
  const datasets = Object.values(chartData).map((data) => {
    return columnTitles.reduce((acc, title, index) => {
      if (index === 0) {
        acc[title] = data.chartData.labels;
      } else {
        // Convert dataset data to number if possible
        acc[title] = data.tableData.tableDatasets[index - 1].data.map((item) =>
          isNaN(Number(item)) ? item : Number(item)
        );
      }
      return acc;
    }, {});
  });

  return {
    columnTitles: columnTitles,
    datasets: datasets,
  };
}

export function convertHeadCountChartDataToExcelFormat(
  headCountData,
  dataCutoffDate
) {
  return convertBarGraphToExcelFormat(
    headCountData,
    "headcount",
    "last",
    "Headcount",
    dataCutoffDate,
    convertToHeadcountChartData
  );
}

export function convertTotalVisitsChartDataToExcelFormat(
  growthData,
  dataCutoffDate
) {
  return convertBarGraphToExcelFormat(
    growthData,
    "visits",
    "sum",
    "Total Visits",
    dataCutoffDate,
    convertToGrowthChartData
  );
}

export function convertWebUsersChartDataToExcelFormat(
  growthData,
  dataCutoffDate
) {
  return convertBarGraphToExcelFormat(
    growthData,
    "users",
    "mean",
    "Users",
    dataCutoffDate,
    convertToGrowthChartData
  );
}
