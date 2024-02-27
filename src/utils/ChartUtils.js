import {
  findInsertIndex,
  convertLabelToDate,
  getTableInfo,
  aggregateData,
  preprocessAppDataTypes,
  fromUnderscoreCase,
  roundPeNumbers,
  normalizeStackedAggData,
  convertToGrowthData,
  calculateMean,
  sumRelatedTableRows,
} from "./Utils";
import {
  CHARTS,
  CHARTJS_COLORS,
  TRAFFIC_BY_CHANNEL_COLORS,
} from "../constants";

// Below are API data converters
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

  const processedValues = values.slice(cutoffIndex).map((item) => item ?? "--");
  const chartData = {
    labels: labels.slice(cutoffIndex),
    datasets: [
      {
        label: displayedLabel,
        data: processedValues,
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

export function checkIfGrowthDataHasValuesGreaterThanOneMillion(
  data,
  dataCutoffDate
) {
  let { labels, values, tableHeaders, tableLabels, growthPercentages } =
    getTableInfo(data);
  const cutoffIndex = findInsertIndex(
    labels.map((x) => convertLabelToDate(x)),
    dataCutoffDate,
    "left"
  );

  return values.slice(cutoffIndex).some((x) => x > 1e6);
}

export function convertToGrowthChartData(
  data,
  displayedLabel,
  dataCutoffDate,
  units = null // Make sure either "M", "K", or null
) {
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
        label:
          displayedLabel +
          `${units === "M" ? " (M)" : units === "K" ? " (K)" : ""}`,
        data: values
          .map((item) =>
            item == null
              ? "--"
              : (
                  item / (units === "M" ? 1e6 : units === "K" ? 1e3 : 1)
                ).toFixed(1)
          )
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

export function convertToChannelDoughnutData(
  trafficData,
  type = "traffic_by_channel"
) {
  const relevant_keys = getRelevantTrafficKeys(type);

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
    labels: relevant_keys.map(formatRelevantTrafficKeys),
    datasets: [
      {
        data: percentages,
        rawData: Object.values(sums),
        borderWidth: 1,
        backgroundColor:
          type === "traffic_by_channel"
            ? Object.values(TRAFFIC_BY_CHANNEL_COLORS) // Order of values must be right
            : null,
        // Here you could add backgroundColors and other properties as needed
      },
    ],
  };
}

function getRelevantTrafficKeys(type) {
  switch (type) {
    case "traffic_by_channel":
      return [
        "direct",
        "mail",
        "search_organic",
        "social_organic",
        "referral",
        "search_paid",
        "social_paid",
        "display_ad",
      ];
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

function formatRelevantTrafficKeys(key) {
  const displayedKeyMap = {
    direct: "Direct",
    mail: "Mail",
    referral: "Referral",
    social: "Social",
    search_organic: "Organic Search",
    social_organic: "Organic Social",
    search_paid: "Paid Search",
    social_paid: "Paid Social",
    display_ad: "Display Ads",
    unknown_channel: "Other",
  };
  if (key in displayedKeyMap) {
    return displayedKeyMap[key];
  } else {
    return fromUnderscoreCase(key);
  }
}

export function convertToChannelChartData(
  trafficData,
  type = "traffic_by_channel",
  timescale,
  dataCutoffDate
) {
  const paidTrafficKeys = [
    "referrals",
    "search_paid",
    "social_paid",
    "display_ad",
  ];
  const paidTrafficRowName = "Total Paid";
  const organicTrafficKeys = [
    "direct",
    "mail",
    "search_organic",
    "social_organic",
  ];
  const organicTrafficRowName = "Total Organic";
  let trafficByChannelColors;
  const relevant_keys = getRelevantTrafficKeys(type);

  let addOrganicPaidRows = false;
  if (type === "traffic_by_channel") {
    addOrganicPaidRows = true;
    trafficByChannelColors = TRAFFIC_BY_CHANNEL_COLORS;
  }

  const aggData = relevant_keys.reduce((acc, key) => {
    const displayedKey = formatRelevantTrafficKeys(key);
    // condensePaidKeys && paidTrafficKeys.includes(key)
    //   ? paidTrafficRowName
    //   : formatRelevantTrafficKeys(key);

    acc[displayedKey] = aggregateData(trafficData, key, "sum", timescale);
    return acc;
  }, {});

  // aggData: {direct: {time_key: output_key}, mail: {time_key: output_key}, ...}
  const firstChannelData = aggData[formatRelevantTrafficKeys(relevant_keys[0])]; // use to extract timescale
  const cutoffIndex = findInsertIndex(
    Object.keys(firstChannelData).map((x) => convertLabelToDate(x)),
    dataCutoffDate,
    "left"
  );
  const percentAggData = normalizeStackedAggData(aggData);
  // console.log("percentAggData", percentAggData);
  const chartData = {
    labels: Object.keys(firstChannelData).slice(cutoffIndex),
    datasets: Object.keys(aggData).map((key) => ({
      data: Object.values(percentAggData[key])
        .slice(cutoffIndex)
        .map(
          (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
        ),
      rawData: Object.values(aggData[key]).slice(cutoffIndex),
      backgroundColor: trafficByChannelColors?.[key], // If undefined, ChartJS will use default colors
      borderWidth: 1,
      label: key,
    })),
  };

  let tableDatasets = chartData["datasets"];
  if (addOrganicPaidRows) {
    tableDatasets = JSON.parse(JSON.stringify(chartData["datasets"]));
    for (const [rowName, relatedKeys] of [
      [paidTrafficRowName, paidTrafficKeys],
      [organicTrafficRowName, organicTrafficKeys],
    ]) {
      const lastOrganicKeyIndex = relevant_keys.lastIndexOf(
        relatedKeys[relatedKeys.length - 1]
      );
      const newRowPosition = lastOrganicKeyIndex + 1; // Position after the last organic key
      const newRow = JSON.parse(JSON.stringify(tableDatasets[0])); // Deep copy the first row
      newRow.label = rowName;
      newRow.data = sumRelatedTableRows(
        tableDatasets,
        relatedKeys.map((key) => formatRelevantTrafficKeys(key)),
        "data"
      );
      newRow.rawData = sumRelatedTableRows(
        tableDatasets,
        relatedKeys.map((key) => formatRelevantTrafficKeys(key)),
        "rawData"
      );

      // Insert the new row into the tableDatasets at the calculated position
      tableDatasets.splice(newRowPosition, 0, newRow);
    }
  }

  let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: tableDatasets,
    topBorderedRows: [paidTrafficRowName],
    highlightedRows: {
      // Direct: "bg-primaryLight",
      [organicTrafficRowName]: "bg-customGray-75",
      [paidTrafficRowName]: "bg-customGray-75",
      // [totalTrafficRow.label]: "bg-customGray-75",
    },
  };

  return { chartData: chartData, tableData: tableData };
}

export function convertToGeoMarketShareData(
  geoTrafficData,
  timescale,
  cutOffDate
) {
  const relevantContinents = Object.keys(geoTrafficData);
  const aggData = relevantContinents.reduce((acc, key) => {
    acc[key] = aggregateData(
      geoTrafficData[key],
      "traffic", // outpkey for geo
      "sum",
      timescale
    );
    return acc;
  }, {});

  // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}
  const firstChannelData = aggData[relevantContinents[0]]; // use to extract timescale\
  const percentAggData = normalizeStackedAggData(aggData);
  const chartData = {
    labels: Object.keys(firstChannelData),
    datasets: Object.keys(aggData).map((key) => ({
      data: Object.values(percentAggData[key]).map(
        (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
      ),
      rawData: Object.values(aggData[key]),
      borderWidth: 1,
      label: key,
    })),
  };

  let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

  const cutoffIndex = findInsertIndex(
    Object.keys(firstChannelData).map((x) => convertLabelToDate(x)),
    cutOffDate,
    "left"
  );

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [...chartData["datasets"]],
    topBorderedRows: [],
    highlightedRows: {},
  };

  return { chartData: chartData, tableData: tableData };
}

export function convertToLineChartData(
  dataByCompany,
  timescale,
  cutOffDate,
  outputKey = "est_average_active_users",
  useGrowth = true
) {
  const companyNames = Object.keys(dataByCompany);
  const aggData = companyNames.reduce((acc, key) => {
    acc[key] = aggregateData(dataByCompany[key], outputKey, "mean", timescale);
    return acc;
  }, {});
  // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}

  const firstCompanyData = aggData[companyNames[0]]; // use to extract timescale
  const cutoffIndex = findInsertIndex(
    Object.keys(firstCompanyData).map((x) => convertLabelToDate(x)),
    cutOffDate,
    "left"
  );

  const transformedAggData = companyNames.reduce((acc, key) => {
    if (useGrowth) {
      acc[key] = convertToGrowthData(aggData[key], "number").slice(cutoffIndex);
    } else {
      acc[key] = Object.values(aggData[key]).slice(cutoffIndex);
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(firstCompanyData).slice(cutoffIndex),
    datasets: Object.keys(aggData).map((key) => ({
      data: Object.values(transformedAggData[key]).map(
        (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
      ),
      rawData: Object.values(aggData[key]).slice(cutoffIndex),
      borderWidth: 2,
      label: key,
    })),
  };

  let { tableHeaders, tableLabels } = getTableInfo(firstCompanyData);

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [...chartData["datasets"]],
    topBorderedRows: [],
    highlightedRows: {},
  };

  return { chartData: chartData, tableData: tableData };
}

export function convertToMarketShareData(
  trafficData,
  timescale,
  cutOffDate,
  outputKey = "visits"
) {
  const companyNames = Object.keys(trafficData);
  const aggData = companyNames.reduce((acc, key) => {
    acc[key] = aggregateData(trafficData[key], outputKey, "sum", timescale);
    return acc;
  }, {});

  // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}
  const firstChannelData = aggData[companyNames[0]]; // use to extract timescale\
  const percentAggData = normalizeStackedAggData(aggData);
  const chartData = {
    labels: Object.keys(firstChannelData),
    datasets: Object.keys(aggData).map((key) => ({
      data: Object.values(percentAggData[key]).map(
        (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
      ),
      rawData: Object.values(aggData[key]),
      borderWidth: 1,
      label: key,
    })),
  };
  // chartData.datasets = convertStackedChartDataToPercent(chartData.datasets); // convert to percent so bars add to 100%

  let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

  const cutoffIndex = findInsertIndex(
    Object.keys(firstChannelData).map((x) => convertLabelToDate(x)),
    cutOffDate,
    "left"
  );
  // console.log("WEBSTAc cutoff", cutoffIndex, Object.keys(firstChannelData));

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [...chartData["datasets"]],
    topBorderedRows: [],
    highlightedRows: {},
  };

  return { chartData: chartData, tableData: tableData };
}

export function convertToTrafficBreakdownVsPeersGeoData(
  geoTrafficData,
  outputKey = "traffic"
) {
  // Get the date 12 months ago from today
  const date12MonthsAgo = new Date();
  date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

  // Initialize an object to hold company-wise percentage breakdowns
  const companyPercentages = {};

  const companyRawData = {};

  // Iterate over each company in the geoTrafficData
  Object.entries(geoTrafficData).forEach(([company, data]) => {
    // Aggregate data for the last 12 months for each company
    const aggregatedData = Object.entries(data).reduce(
      (acc, [continent, continentData]) => {
        const yearlyData = Object.entries(continentData).reduce(
          (sum, [date, value]) => {
            const entryDate = new Date(date);
            if (entryDate >= date12MonthsAgo) {
              sum += value[outputKey] || 0;
            }
            return sum;
          },
          0
        );
        acc[continent] = yearlyData;
        return acc;
      },
      {}
    );

    // Calculate the total sum of all traffic data for the last 12 months for the company
    const totalTraffic = Object.values(aggregatedData).reduce(
      (sum, value) => sum + value,
      0
    );

    // Convert the aggregated data into percentages for the company
    const percentages = Object.entries(aggregatedData).reduce(
      (acc, [continent, value]) => {
        acc[continent] = (value / totalTraffic) * 100;
        return acc;
      },
      {}
    );

    // Assign the calculated percentages to the company
    companyPercentages[company] = percentages;
    companyRawData[company] = { ...aggregatedData };
  });

  // Prepare the data for the chart
  const companies = Object.keys(companyPercentages);
  let continents = companies
    .reduce((acc, company) => {
      const companyData = companyPercentages[company];
      Object.keys(companyData).forEach((continent) => {
        if (!acc.includes(continent)) acc.push(continent);
      });
      return acc;
    }, [])
    .sort();

  // Ensure North America is always first
  const northAmericaIndex = continents.indexOf("North America");
  if (northAmericaIndex > -1) {
    continents.splice(northAmericaIndex, 1);
    continents = ["North America", ...continents];
  }

  const dataset = continents.map((continent) => {
    const data = companies.map(
      (company) => companyPercentages[company][continent] || 0
    );
    const rawData = companies.map(
      (company) => companyRawData[company][continent] || 0
    );
    return {
      label: continent,
      data: data,
      rawData: rawData,
      borderWidth: 1,
    };
  });

  return {
    labels: companies,
    datasets: dataset,
  };
}

export function convertToTrafficBreakdownVsPeersData(
  trafficData,
  type = "traffic_by_channel"
) {
  const relevant_keys = getRelevantTrafficKeys(type);

  // Get the date 12 months ago from today
  const date12MonthsAgo = new Date();
  date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 12);

  // Initialize an object to accumulate the sums
  const sums = relevant_keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  // Initialize an object to hold company-wise percentage breakdowns
  // E.g. {company1: [10, 20, 30], company2: [10, 20, 30], ...}
  const companyPercentages = {};

  const companyRawData = {};

  // Iterate over each company in the trafficData
  Object.keys(trafficData).forEach((company) => {
    const companyData = trafficData[company];
    const companySums = {};

    // Aggregate data for the last 12 months for each company
    Object.keys(companyData).forEach((date) => {
      const dataEntry = companyData[date];
      const entryDate = new Date(date);

      if (entryDate >= date12MonthsAgo) {
        relevant_keys.forEach((key) => {
          if (!companySums[key]) companySums[key] = 0;
          if (dataEntry.hasOwnProperty(key)) {
            companySums[key] += dataEntry[key];
          }
        });
      }
    });

    // Calculate total sum for the last 12 months for the company
    const total = Object.values(companySums).reduce(
      (acc, value) => acc + value,
      0
    );

    // Convert these to percentages for each relevant key
    const percentages = relevant_keys.reduce((acc, key) => {
      acc[key] = (companySums[key] / total) * 100;
      return acc;
    }, {});

    // Assign the calculated percentages to the company
    companyPercentages[company] = percentages;
    companyRawData[company] = { ...companySums };
  });

  return {
    labels: Object.keys(companyPercentages),
    datasets: [
      ...relevant_keys.map((key) => ({
        data: Object.values(companyPercentages).map(
          (percentages) => percentages[key]
        ),
        rawData: Object.values(companyRawData).map((company) => company[key]),
        borderWidth: 1,
        backgroundColor:
          type === "traffic_by_channel"
            ? TRAFFIC_BY_CHANNEL_COLORS[formatRelevantTrafficKeys(key)]
            : null,
        label: formatRelevantTrafficKeys(key),
      })),
    ],
  };
}

export function convertToAppUsageMarketShareVsPeersData(
  appData,
  timescale,
  outputKey = "est_average_active_users"
) {
  const companyNames = Object.keys(appData);
  const aggData = companyNames.reduce((acc, key) => {
    acc[key] = aggregateData(appData[key], outputKey, "mean", timescale);
    return acc;
  }, {});

  // aggData: {company1: {timekey: visits}, company2: {timekey: visits}, ...}
  const firstChannelData = aggData[companyNames[0]]; // use to extract timescale
  const percentAggData = normalizeStackedAggData(aggData);
  const chartData = {
    labels: Object.keys(firstChannelData),
    datasets: Object.keys(aggData).map((key) => ({
      data: Object.values(percentAggData[key]).map(
        (x) => (x ? Number(roundPeNumbers(x)) : null) // this will convert null to 0
      ),
      rawData: Object.values(aggData[key]),
      borderWidth: 1,
      label: key,
    })),
  };
  // chartData.datasets = convertStackedChartDataToPercent(chartData.datasets); // convert to percent so bars add to 100%

  let { tableHeaders, tableLabels } = getTableInfo(firstChannelData);

  const cutoffIndex = 0;

  const tableData = {
    tableHeaders: tableHeaders.slice(cutoffIndex),
    tableLabels: tableLabels.slice(cutoffIndex),
    tableDatasets: [...chartData["datasets"]],
    topBorderedRows: [],
    highlightedRows: {},
  };

  return { chartData: chartData, tableData: tableData };
}

export function convertToAppUsageLoyaltyVsPeersData(
  multiCompanyAppData,
  type = CHARTS.appLTMTimePerUser
) {
  // const relevant_keys = getRelevantKeys(type);
  const processedMultiCompanyData = preprocessAppDataTypes(
    multiCompanyAppData,
    type
  );
  // Get the date 12 months ago from today
  const date12MonthsAgo = new Date();
  date12MonthsAgo.setMonth(date12MonthsAgo.getUTCMonth() - 13);
  const companyAverages = Object.keys(processedMultiCompanyData).reduce(
    (acc, company) => {
      acc[company] = roundPeNumbers(
        calculateMean(
          Object.entries(processedMultiCompanyData[company])
            .filter(([time, data]) => new Date(time) >= date12MonthsAgo)
            .map(([time, data]) => data)
        )
      );
      return acc;
    },
    {}
  );
  const datasets = [
    {
      label: "",
      data: Object.values(companyAverages), // [15, 10, 8]
      backgroundColor: CHARTJS_COLORS,
      barThickness: 48,
    },
  ];

  return {
    labels: Object.keys(companyAverages), // Single label as we have separate datasets for each company
    datasets: datasets,
  };
}

export function convertToAppLoyaltyPeersLineData(
  multiCompanyAppData,
  timescale,
  cutoffDate,
  type = CHARTS.appLTMTimePerUser
) {
  const processedMultiCompanyData = preprocessAppDataTypes(
    multiCompanyAppData,
    type
  );
  // Convert from {company: {time: data}} -> {company: {time: {type: data}}} to use aggregateData() function
  const convertedDict = Object.entries(processedMultiCompanyData).reduce(
    (acc, [company, timeData]) => {
      const convertedTimeData = Object.entries(timeData).reduce(
        (timeAcc, [time, data]) => {
          timeAcc[time] = { [type]: data };
          return timeAcc;
        },
        {}
      );

      acc[company] = convertedTimeData;
      return acc;
    },
    {}
  );
  return convertToLineChartData(
    convertedDict,
    timescale,
    cutoffDate,
    type,
    false // useGrowth
  );
}

// Below are Excel data converters
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

  const columnTitles = Array.from(
    { length: Object.keys(chartData).length },
    () => [
      "Date",
      ...monthChartData.tableData.tableDatasets.map((dataset) => dataset.label),
    ]
  );

  const datasets = Object.values(chartData).map((data, dataIndex) => {
    return columnTitles[dataIndex].reduce((acc, title, index) => {
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
function convertDoughnutGraphToExcelFormat(trafficData, titles) {
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
  return {
    ...convertBarGraphToExcelFormat(
      headCountData,
      "headcount",
      "last",
      "Headcount",
      dataCutoffDate,
      convertToHeadcountChartData
    ),
    sheetName: "Headcount",
  };
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
    traffic_by_organic_paid: "Organic vs Paid",
  };
  let doughnutTrafficData = Object.keys(types).map((type) =>
    convertToChannelDoughnutData(trafficData, type)
  );
  let doughnutGeoTrafficData = convertToGeoDoughnutData(geoTrafficData);
  let titles = ["Geography", ...Object.values(types)];

  return convertDoughnutGraphToExcelFormat(
    [doughnutGeoTrafficData, ...doughnutTrafficData],
    titles
  );
}

export function convertTrafficByChannelChartDataToExcelFormat(
  trafficData,
  dataCutoffDate
) {
  const timeFrames = ["month", "quarterYear", "year"];
  return timeFrames.map((timeFrame) =>
    convertToChannelChartData(
      trafficData,
      "traffic_by_channel",
      timeFrame,
      dataCutoffDate
    )
  );
}

export function convertTrafficGrowthVsPeersChartDataToExcelFormat(
  trafficData,
  dataCutoffDate
) {
  const timeFrames = ["month", "quarterYear", "year"];
  return timeFrames.map((timeFrame) =>
    convertToLineChartData(trafficData, timeFrame, dataCutoffDate, "visits")
  );
}

export function convertTrafficMarketShareVsPeersDataToExcelFormat(
  trafficData,
  dataCutoffDate
) {
  const timeFrames = ["month", "quarterYear", "year"];
  return timeFrames.map((timeFrame) =>
    convertToMarketShareData(trafficData, timeFrame, dataCutoffDate)
  );
}

export function convertTrafficBreakdownVsPeersDataToExcelFormat(
  geoTrafficData,
  trafficData
) {
  const types = {
    traffic_by_channel: "Channel",
    traffic_by_device: "Device",
    traffic_by_organic_paid: "Organic vs Paid",
  };
  let stackedTrafficData = Object.keys(types).map((type) =>
    convertToTrafficBreakdownVsPeersData(trafficData, type)
  );
  let stackedGeoTrafficData =
    convertToTrafficBreakdownVsPeersGeoData(geoTrafficData);
  let titles = ["Geography", ...Object.values(types)];

  let result = [stackedGeoTrafficData, ...stackedTrafficData].map(
    (data, index) => {
      return {
        chartData: { ...data, category: titles[index] },
        tableData: {},
      };
    }
  );

  return result;
}

export function convertAppUsersChartDataToExcelFormat(appData, dataCutoffDate) {
  return convertBarGraphToExcelFormat(
    appData,
    "est_average_active_users",
    "mean",
    "Active Users",
    dataCutoffDate,
    convertToGrowthChartData
  );
}

export function convertAppUsageGrowthVsPeersChartDataToExcelFormat(
  dataAI,
  dataCutoffDate
) {
  const multiCompanyAppPerformance = Object.keys(dataAI).reduce(
    (acc, companyName) => {
      if (dataAI[companyName]) {
        acc[companyName] = dataAI[companyName]["app_performance"];
      }
      return acc;
    },
    {}
  );
  const timeFrames = ["month", "quarterYear", "year"];
  return timeFrames.map((timeFrame) =>
    convertToLineChartData(
      multiCompanyAppPerformance,
      timeFrame,
      dataCutoffDate
    )
  );
}

export function convertAppUsageMarketShareVsPeersDataToExcelFormat(dataAI) {
  const multiCompanyAppPerformance = Object.keys(dataAI).reduce(
    (acc, companyName) => {
      if (dataAI[companyName]) {
        acc[companyName] = dataAI[companyName]["app_performance"];
      }
      return acc;
    },
    {}
  );
  const timeFrames = ["month", "quarterYear", "year"];

  return timeFrames.map((timeFrame) =>
    convertToAppUsageMarketShareVsPeersData(
      multiCompanyAppPerformance,
      timeFrame
    )
  );
}

export function convertAppUsageLoyalUsersVsPeersDataToExcelFormat(dataAI) {
  const timeFrames = [
    CHARTS.appLTMRetentionM3,
    CHARTS.appLTMRetentionM6,
    CHARTS.appLTMTimePerUser,
    CHARTS.appLTMTimePerSession,
  ];

  return {
    columnTitles: timeFrames.map((timeFrame) => ["Company", timeFrame]),
    datasets: timeFrames.map((timeFrame) => {
      let convertedData = convertToAppUsageLoyaltyVsPeersData(
        dataAI,
        timeFrame
      );
      return {
        Company: convertedData.labels,
        [timeFrame]: convertedData.datasets[0].data.map((item) =>
          isNaN(Number(item)) ? item : Number(item)
        ),
      };
    }),
    differentColors: true,
    titles: timeFrames,
    sheetName: "Loyalty vs. Peers",
  };
}
