import {
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  aggregateData,
  fromUnderscoreCase,
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

export function convertToGeoDoughnutData(
  geoTrafficData,
  outputKey = "traffic"
) {
  // Get the date 12 months ago from today
  const date12MonthsAgo = new Date();
  date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

  // Aggregate data for the last 12 months
  const aggregatedData = Object.entries(geoTrafficData).reduce(
    (acc, [continent, data]) => {
      const yearlyData = Object.entries(data).reduce((sum, [date, value]) => {
        const entryDate = new Date(date);
        if (entryDate >= date12MonthsAgo) {
          sum += value[outputKey] || 0;
        }
        return sum;
      }, 0);
      acc[continent] = yearlyData;
      return acc;
    },
    {}
  );

  // Calculate the total sum of all traffic data for the last 12 months
  const totalTraffic = Object.values(aggregatedData).reduce(
    (sum, value) => sum + value,
    0
  );

  // Convert the aggregated data into percentages
  const percentages = Object.values(aggregatedData).map(
    (value) => (value / totalTraffic) * 100
  );

  // Prepare the data for the Pie chart
  const labels = Object.keys(aggregatedData);

  return {
    labels: labels,
    datasets: [
      {
        data: percentages,
        rawData: Object.values(aggregatedData),
        borderWidth: 1,
      },
    ],
  };
}

export function convertToChannelChartData(
  trafficData,
  type = "traffic_by_channel"
) {
  const relevant_keys = getRelevantKeys(type);

  // Get the date 12 months ago from today
  const date12MonthsAgo = new Date();
  date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

  // Initialize an object to accumulate the sums
  const sums = relevant_keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  // Aggregate data for the last 12 months
  Object.keys(trafficData).forEach((date) => {
    const dataEntry = trafficData[date];
    const entryDate = new Date(date);

    if (entryDate >= date12MonthsAgo) {
      relevant_keys.forEach((key) => {
        if (dataEntry.hasOwnProperty(key)) {
          sums[key] += dataEntry[key];
        }
      });
    }
  });

  // Now that we have total sums for the last 12 months, convert these to percentages
  const total = Object.values(sums).reduce((acc, value) => acc + value, 0);
  const percentages = relevant_keys.map((key) => (sums[key] / total) * 100);

  return {
    labels: relevant_keys.map(fromUnderscoreCase),
    datasets: [
      {
        data: percentages,
        rawData: Object.values(sums),
        borderWidth: 1,
        // Here you could add backgroundColors and other properties as needed
      },
    ],
  };
}

function getRelevantKeys(type) {
  switch (type) {
    case "traffic_by_channel":
      return ["direct", "mail", "social", "search", "referral", "display_ad"];
    case "traffic_by_device":
      return ["mobile_visits", "desktop_visits"];
    case "users_by_device":
      return ["mobile_users", "desktop_users"];
    case "traffic_by_organic_paid":
      return ["search_organic", "social_organic", "search_paid", "social_paid"];
    default:
      return [];
  }
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

/* trafficData is an array of objects */
export function convertDoughnutGraphToExcelFormat(trafficData, titles) {
  const columnTitles = titles;
  const datasets = trafficData.map((data) => {
    return data.labels.reduce((acc, label, index) => {
      const datapoint = data.datasets[0].rawData[index];
      acc[label] = isNaN(Number(datapoint)) ? datapoint : Number(datapoint);
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

export function convertBreakdownChartDataToExcelFormat(
  geoTrafficData,
  trafficData
) {
  const types = {
    traffic_by_channel: "Channel",
    traffic_by_device: "Device",
    traffic_by_organic_paid: "Search",
  };
  let doughnutTrafficData = Object.keys(types).map((type) =>
    convertToChannelChartData(trafficData, type)
  );
  let doughnutGeoTrafficData = convertToGeoDoughnutData(geoTrafficData);
  let titles = ["Geography", ...Object.values(types)];

  return convertDoughnutGraphToExcelFormat(
    [doughnutGeoTrafficData, ...doughnutTrafficData],
    titles
  );
}