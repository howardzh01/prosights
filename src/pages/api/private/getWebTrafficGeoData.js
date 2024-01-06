// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";

import { serviceSup, cachedFetch } from "../../../utils/Supabase.js";
import { parseSemrushOutput } from "../../../utils/BackendUtils.js";
import { generateMonths } from "../../../utils/Utils.js";

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
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companyUrl, geoType } = reqJSON;
  const displayDates = generateMonths(2019);
  //   const displayDates = ["2023-10-01"];
  const promises = displayDates.map(async (date) => {
    const webTrafficData = await getSemrushGeoTraffic(
      companyUrl,
      date,
      geoType
    );
    return parseSemrushOutput(webTrafficData);
  });

  const webTrafficHistoricalData = await Promise.all(promises);
  console.log(webTrafficHistoricalData);
  return new Response(JSON.stringify(webTrafficHistoricalData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
