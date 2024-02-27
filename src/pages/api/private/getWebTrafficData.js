// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";
const assert = require("assert");

import { serviceSup, cachedFetch } from "../../../utils/Supabase.js";
import { parseSemrushOutput } from "../../../utils/BackendUtils.js";
import {
  generateMonthsFromStartYear,
  reformatWebsiteUrl,
  mergeAndOperate,
} from "../../../utils/Utils.js";
import { limitConcurrency } from "../../../utils/ConcurrencyUtils";

export const config = {
  runtime: "edge",
};
// "Note: categories" cannot be in  exportColumns due to parseSemrushOutput handling ;
const exportColumns =
  "target,rank,visits,desktop_visits,mobile_visits,users,desktop_users,mobile_users,desktop_hits,mobile_hits,direct,search_organic,search_paid,social_organic,social_paid,referral,mail,display_ad,search,social,paid,unknown_channel,time_on_site,desktop_time_on_site,mobile_time_on_site,pages_per_visit,desktop_pages_per_visit,mobile_pages_per_visit,bounce_rate,desktop_bounce_rate,mobile_bounce_rate,desktop_share,mobile_share,accuracy,display_date,country,device_type";

const getSemrushWebTraffic = async (companyUrl, displayDate, country) => {
  // Rest of World Case
  if (country === "ROW") {
    const [worldData, usData] = await Promise.all([
      getSemrushWebTraffic(companyUrl, displayDate, "WW"),
      getSemrushWebTraffic(companyUrl, displayDate, "US"),
    ]);
    if (!worldData || !usData) {
      return;
    }
    const relevant_keys =
      "visits,desktop_visits,mobile_visits,users,desktop_users,mobile_users,desktop_hits,mobile_hits,direct,search_organic,search_paid,social_organic,social_paid,referral,mail,display_ad,search,social,paid,unknown_channel";
    const merged_on = ["target", "display_date", "device_type"];
    const restOfWorldData = mergeAndOperate(
      worldData[0],
      usData[0],
      relevant_keys.split(","),
      merged_on,
      (x, y) => x - y
    );
    if (!restOfWorldData) {
      // meaning misaligned keys
      return;
    }
    return [restOfWorldData];
  }
  // monthly headcount data in reverse chronological order
  const url = new URL("https://api.semrush.com/analytics/ta/api/v3/summary");
  url.search = new URLSearchParams({
    targets: companyUrl,
    export_columns: exportColumns,
    key: process.env.SEMRUSH_API_KEY,
    display_date: displayDate,
  });
  if (country !== "WW" && country !== "ROW") {
    url.searchParams.append("country", country);
  }
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
  return parseSemrushOutput(output);
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  const reqJSON = await req.json();
  const { userId, companyUrl, country } = reqJSON;
  const displayDates = generateMonthsFromStartYear(2019);

  // Create tasks for each date
  const tasks = displayDates.map((date) => {
    return () =>
      getSemrushWebTraffic(reformatWebsiteUrl(companyUrl), date, country);
  });

  // Limit to 20 concurrent tasks with a 5-second timeout
  const webTrafficHistoricalData = await limitConcurrency(tasks, 25, 5000)
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.error("Error fetching web traffic data:", error);
      return [];
    });

  return new Response(JSON.stringify(webTrafficHistoricalData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
