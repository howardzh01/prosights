// Get HeadCount data from coresignal

// process.env.OPENAI_API_KEY ?? "";

import { serviceSup, cachedBucketFetch } from "../../../utils/Supabase.js";
import { parseSemrushOutput } from "../../../utils/BackendUtils.js";

export const config = {
  runtime: "edge",
};

const getCrunchbaseData = async (companyName, cardNames) => {
  // retrieve cards for a specific company
  // cardName is an array
  const url = new URL(
    `https://api.crunchbase.com/api/v4/entities/organizations/${companyName}`
  );
  const headers = {
    accept: "application/json",
    "X-cb-user-key": process.env.CRUNCHBASE_API_KEY,
  };
  url.search = new URLSearchParams({
    card_ids: cardNames.join(","),
  });
  const output = await cachedBucketFetch({
    url: url,
    options: {
      method: "GET",
      headers: headers,
    },
    serviceSup: serviceSup,
    responseFormat: "json",
    table_name: "crunchbase_api_calls",
  });
  if (!output) {
    return;
  }
  const outputDic = JSON.parse(output);
  if ("error" in outputDic || !("cards" in outputDic)) {
    console.log("getCrunchbaseData Error", outputDic);
    return;
  }
  return outputDic["cards"];
};
// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  // console.log(req.companyName);
  const reqJSON = await req.json();
  const { userId, companyName } = reqJSON;
  const cardNames = [
    "fields",
    "raised_funding_rounds",
    "participated_investments",
    "founders",
    "acquiree_acquisitions",
    "acquirer_acquisitions",
    "jobs",
    "headquarters_address",
  ];
  const crunchbaseData = await getCrunchbaseData(companyName, cardNames);
  if (!crunchbaseData) {
    return new Response(JSON.stringify({ error: "Company not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const unwrap = ({
    fields,
    raised_funding_rounds,
    participated_investments,
    acquiree_acquisitions,
  }) => ({
    fields,
    raised_funding_rounds,
    participated_investments,
    acquiree_acquisitions,
  });
  return new Response(JSON.stringify(unwrap(crunchbaseData)), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
