// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";
const assert = require("assert");

import { serviceSupabase } from "../../../utils/Supabase.js";
import { generateMonths, cachedFetch } from "../../../utils/Utils";

export const config = {
  runtime: "edge",
};

const serviceSup = serviceSupabase();

function parseSemrushOutput(output) {
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
const getSemrushWebTraffic = async (
  companiesUrl,
  exportColumns,
  displayDate
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
  const output = await cachedFetch(
    url,
    {
      method: "GET",
    },
    serviceSup,
    "text"
  );
  return output;

  //   const response = await fetch(url, {
  //     method: "GET",
  //   });

  //   if (!response.ok) {
  //     console.log("error", response.status);
  //   }
  //   return response.text();
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companiesUrl, exportColumns } = reqJSON;
  const displayDates = generateMonths(2019);
  //   const displayDates = ["2023-10-01"];
  const promises = displayDates.map(async (date) => {
    const webTrafficData = await getSemrushWebTraffic(
      companiesUrl,
      exportColumns,
      date
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
