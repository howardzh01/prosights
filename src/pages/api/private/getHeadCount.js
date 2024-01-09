// Get HeadCount data from coresignal

import { serviceSup, cachedFetch } from "../../../utils/Supabase.js";

export const config = {
  runtime: "edge",
};

const getCSignalHeadCount = async (company) => {
  // monthly headcount data in reverse chronological order

  // const response = await fetch(
  //   `https://api.coresignal.com/cdapi/v1/linkedin/historical_headcount/collect/${company}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       Authorization: `Bearer ${process.env.CORESIGNAL_API_KEY ?? ""}`,
  //     },
  //     // body: JSON.stringify({}),
  //     // signal: controller.signal,
  //   }
  // );

  // if (!response.ok) {
  //   console.log("error", response.status);
  // }
  // // console.log("hi", response);
  // return response.json();

  const output = await cachedFetch(
    `https://api.coresignal.com/cdapi/v1/linkedin/historical_headcount/collect/${company}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.CORESIGNAL_API_KEY ?? ""}`,
      },
    },
    serviceSup,
    "json"
  );
  if (!output) {
    return;
  }

  return JSON.parse(output); // TODO: convert output json string to JSON
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companyName } = reqJSON;
  // console.log("before", companyName);
  const headcountData = await getCSignalHeadCount(companyName);
  if (!headcountData) {
    return new Response(JSON.stringify([]), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const unwrap = ({ created, headcount }) => ({ created, headcount });
  return new Response(
    JSON.stringify(headcountData.map((monthData) => unwrap(monthData))),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export default handler;
