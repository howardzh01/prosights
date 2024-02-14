// Get App Data from DataAI

import { serviceSup, cachedBucketFetch } from "../../../utils/Supabase.js";
import { sleep } from "../../../utils/BackendUtils.js";

const disableDataAI = true;
export const config = {
  runtime: "edge",
};

// const getDataAIId = async (companyName, cardNames) => {};

const customDataAIFetch = async (url, options) => {
  if (disableDataAI) {
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
    await sleep(1000); // sleep 1 second
    const response = await fetch(
      `https://api.data.ai/v2.0/portfolio/fetch-data?report_id=${outputReport["report_id"]}`,
      options
    );
    if (!response.ok) {
      return;
    }
    report = await response.json();
    if (report["report_status"] === "done") {
      console.log(`Report Done after ${i + 1} seconds`);
      return report;
    }
  }
  return;
};

const getDataAIData = async (
  unifiedProductId,
  bundleNames,
  startDate,
  endDate
) => {
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
    countries: "US",
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
  const { userId, companyName, unifiedProductId } = reqJSON;
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
