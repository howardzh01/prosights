const assert = require("assert");
import { findInsertIndex, convertLabelToDate, getTableInfo } from "./Utils";

export function parseSemrushOutput(output) {
  if (!output) {
    return;
  }
  const ret = [];
  const lines = output.trim().split("\n");
  const headers = lines[0].split(";");
  for (let item of lines.slice(1)) {
    assert.strictEqual(
      item.split(";").length,
      headers.length,
      "Number of headers and items do not match"
    );
    let dic = headers.reduce((obj, val, idx) => {
      obj[val] = item.split(";")[idx];
      return obj;
    }, {});
    ret.push(dic);
  }
  return ret;
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
