// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";
const assert = require("assert");

import { serviceSup, cachedFetch } from "../../../utils/Supabase.js";
import { parseSemrushOutput } from "../../../utils/BackendUtils.js";
import { generateMonths } from "../../../utils/Utils.js";

export const config = {
  runtime: "edge",
};

const getSemrushWebTraffic = async (
  companiesUrl,
  exportColumns,
  displayDate,
  country = "global"
) => {
  // monthly headcount data in reverse chronological order
  //   console.log(companiesUrl, exportColumns, displayDate);
  const url = new URL("https://api.semrush.com/analytics/ta/api/v3/summary");
  url.search = new URLSearchParams({
    targets: companiesUrl,
    export_columns: exportColumns,
    key: process.env.SEMRUSH_API_KEY,
    display_date: displayDate,
  });
  if (country !== "global") {
    url.searchParams.append("country", country);
  }
  const output = await cachedFetch(
    url,
    {
      method: "GET",
    },
    serviceSup,
    "text"
  );
  return output;
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  const reqJSON = await req.json();
  const { userId, companiesUrl, exportColumns, country, don } = reqJSON;
  const displayDates = generateMonths(2019);
  //   const displayDates = ["2023-10-01"];
  // "categories" cannot be in  exportColumns due to parseSemrushOutput handling ;
  const promises = displayDates.map(async (date) => {
    const webTrafficData = await getSemrushWebTraffic(
      companiesUrl,
      exportColumns,
      date,
      country
    );
    return parseSemrushOutput(webTrafficData);
  });

  const webTrafficHistoricalData = await Promise.all(promises);

  return new Response(JSON.stringify(webTrafficHistoricalData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
