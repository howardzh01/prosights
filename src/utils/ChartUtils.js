import {
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  aggregateData,
} from "./Utils";

export function convertToChartData(data, cutOffDate) {
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
        label: "HeadCount",
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

export function convertHeadCountChartDataToExcelFormat(
  headCountData,
  dataCutoffDate
) {
  const timeFrames = ["month", "quarterYear", "year"];
  const chartData = Object.fromEntries(
    timeFrames.map((timeFrame) => [
      `${timeFrame}ChartData`,
      convertToChartData(
        aggregateData(headCountData, "headcount", "last", timeFrame),
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
        acc[title] = data.tableData.tableDatasets[index - 1].data;
      }
      return acc;
    }, {});
  });

  return {
    columnTitles: columnTitles,
    datasets: datasets,
  };
}
