// Get App Data from DataAI
import { serviceSup, cachedBucketFetch } from "../../../utils/Supabase.js";
import { sleep } from "../../../utils/BackendUtils.js";
import { mergeAndOperate } from "../../../utils/Utils.js";

const disableDataAI = true;
export const config = {
  runtime: "edge",
};

const alignAppPerformanceByStartDate = (worldData, usData) => {
  // Ensure dates are aligned
  const alignedWorldData = {};
  const alignedUSData = {};

  // Create and sort a set of all start_dates from both datasets
  const allStartDates = [
    ...new Set([
      ...worldData.map((data) => data.start_date),
      ...usData.map((data) => data.start_date),
    ]),
  ].sort((a, b) => new Date(a) - new Date(b));

  // Initialize aligned data with null values
  allStartDates.forEach((date) => {
    alignedWorldData[date] = null;
    alignedUSData[date] = null;
  });

  // Fill in the actual data where available
  worldData.forEach((data) => {
    alignedWorldData[data.start_date] = data;
  });
  usData.forEach((data) => {
    alignedUSData[data.start_date] = data;
  });

  return { alignedWorldData, alignedUSData };
};
const calcRestOfWorldAppPerformance = (worldData, usData) => {
  const subtract_keys = [
    "est_download",
    "est_cumulative_download",
    "est_average_active_users",
    "est_total_time", // bad data
  ];
  const reversed_weighted_average_keys = [
    "est_average_session_per_user",
    "est_average_session_duration",
    "est_average_time_per_user",
    "est_average_active_days",
    "est_percentage_active_days",
  ];
  const merged_on = [
    "unified_product_id",
    "start_date",
    "end_date",
    "granularity",
    "device_code",
  ];

  const worldUsers = worldData["est_average_active_users"];
  const usUsers = usData["est_average_active_users"];

  // First merge operation based on subtraction
  const restOfWorldAppPerformance = mergeAndOperate(
    worldData,
    usData,
    subtract_keys,
    merged_on,
    (x, y) => x - y
  );

  if (!restOfWorldAppPerformance) {
    console.log("Misaligned keys or other issue in first merge operation");
    return null;
  }

  const restOfWorldUsers =
    restOfWorldAppPerformance["est_average_active_users"];
  if (restOfWorldUsers == null) {
    console.log("Null values encountered in restOfWorldUsers");
    return null;
  }

  // Second merge operation based on weighted averages
  const restOfWorldAppPerformance2 = mergeAndOperate(
    worldData,
    usData,
    reversed_weighted_average_keys,
    merged_on,
    (w, u) => (worldUsers * w - usUsers * u) / restOfWorldUsers
  );
  console.log("users us/word", usUsers, worldUsers, restOfWorldUsers);

  return {
    ...restOfWorldAppPerformance,
    ...restOfWorldAppPerformance2,
  };
  // Combine the results of the two merge operations
  // return {
  //   ...worldData,
  //   app_performance: {
  //     ...restOfWorldAppPerformance,
  //     ...restOfWorldAppPerformance2,
  //   },
  //   retention: [], // Assuming retention data is handled separately or not applicable
  // };
};
const customDataAIFetch = async (url, options) => {
  if (disableDataAI) {
    console.log("DataAI is disabled");
    return;
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    console.log(
      "fetchDataAI Initial Error",
      url.toString(),
      typeof response.json === "function" ? await response.json() : undefined,
      response.status,
      response.statusText
    );
    return;
  }
  const outputReport = await response.json();
  console.log("DATAAI report", outputReport);
  // const outputReport = {
  //   report_id: "08_20240214_60e73c7fdd664fc1b33e90a17da3d258",
  // };

  let report;
  for (let i = 0; i < 10; i++) {
    await sleep(2000); // sleep 2 second
    const response = await fetch(
      `https://api.data.ai/v2.0/portfolio/fetch-data?report_id=${outputReport["report_id"]}`,
      options
    );
    if (!response.ok) {
      return;
    }
    report = await response.json();
    if (report["report_status"] === "done") {
      console.log(`Report Done after ${2 * (i + 1)} seconds`);
      return report;
    }
  }
  return;
};

const getDataAIData = async (
  unifiedProductId,
  bundleNames,
  country,
  startDate,
  endDate
) => {
  if (country === "ROW") {
    const [worldData, usData] = await Promise.all([
      getDataAIData(unifiedProductId, bundleNames, "WW", startDate, endDate),
      getDataAIData(unifiedProductId, bundleNames, "US", startDate, endDate),
    ]);
    if (
      !worldData ||
      !usData ||
      !worldData["app_performance"] ||
      !usData["app_performance"]
    ) {
      return;
    }
    const { alignedWorldData, alignedUSData } = alignAppPerformanceByStartDate(
      worldData["app_performance"],
      usData["app_performance"]
    );

    const alignedDataList = Object.keys(alignedWorldData).map((dateKey) =>
      calcRestOfWorldAppPerformance(
        alignedWorldData[dateKey],
        alignedUSData[dateKey]
      )
    );

    // merge the two restOfWorldAppPerformance
    return {
      ...worldData,
      app_performance: alignedDataList,
      retention: [], // because World always is missing retention data
    };
  }

  // retrieve cards for a specific company
  // cardName is an array
  const url = new URL(
    `https://api.data.ai/v2.0/portfolio/unified/app-performance`
  );
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.DATA_AI_API_KEY}`,
  };
  url.search = new URLSearchParams({
    unified_product_id: unifiedProductId,
    granularity: "monthly",
    countries: country,
    devices: "all",
    bundles: bundleNames.join(","),
    start_date: startDate,
    end_date: endDate,
  });
  const output = await cachedBucketFetch({
    url: url,
    options: {
      method: "GET",
      headers: headers,
    },
    customFetchFunction: customDataAIFetch,
    serviceSup: serviceSup,
    responseFormat: "json",
    table_name: "dataai_api_calls",
  });
  if (!output) {
    return;
  }
  const outputDic = JSON.parse(output);
  if ("error" in outputDic) {
    console.log("getDataAi Error", outputDic);
    return;
  }
  return outputDic["products"][0];
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companyName, unifiedProductId, country } = reqJSON;
  const bundleNames = [
    "download_revenue",
    "active_users",
    "engagement",
    "retention",
  ];
  const startDate = "2019-01-01";
  const endDate = "2024-01-31";
  const dataAiData = await getDataAIData(
    unifiedProductId,
    bundleNames,
    country,
    startDate,
    endDate
  );
  if (!dataAiData) {
    return new Response(JSON.stringify({ error: "Company not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(dataAiData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
