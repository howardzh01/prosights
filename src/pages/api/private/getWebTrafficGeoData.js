// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";

import { serviceSup, cachedFetch } from "../../../utils/Supabase.js";
import { parseSemrushOutput } from "../../../utils/BackendUtils.js";
import {
  generateMonthsFromStartYear,
  reformatWebsiteUrl,
} from "../../../utils/Utils.js";
import { limitConcurrency } from "../../../utils/ConcurrencyUtils";

export const config = {
  runtime: "edge",
};

const getSemrushGeoTraffic = async (
  companyUrl,
  displayDate,
  geoType = "country"
) => {
  // export all columns. will yield traffic + users
  const url = new URL("https://api.semrush.com/analytics/ta/api/v3/geo");
  url.search = new URLSearchParams({
    target: companyUrl,
    key: process.env.SEMRUSH_API_KEY,
    display_date: displayDate,
    geo_type: geoType,
  });
  const cacheKeyUrl = new URL(url);
  cacheKeyUrl.searchParams.delete("key");
  const output = await cachedFetch({
    url: url,
    options: {
      method: "GET",
    },
    serviceSup: serviceSup,
    responseFormat: "text",
    tableName: "api_calls_semrush",
    cacheKeyOverride: cacheKeyUrl.toString(),
  });
  return output;
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companyUrl, geoType } = reqJSON;
  const displayDates = generateMonthsFromStartYear(2023); // array of format ["2023-10-01", ...]

  // Create tasks for each date
  const tasks = displayDates.map((date) => {
    return () =>
      getSemrushGeoTraffic(reformatWebsiteUrl(companyUrl), date, geoType).then(
        (webTrafficData) => parseSemrushOutput(webTrafficData)
      );
  });

  // Use limitConcurrency to control the execution of tasks
  const webTrafficHistoricalData = await limitConcurrency(tasks, 25, 5000)
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.error("Error fetching web traffic geo data:", error);
      return [];
    });
  // console.log(webTrafficHistoricalData);
  return new Response(JSON.stringify(webTrafficHistoricalData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
