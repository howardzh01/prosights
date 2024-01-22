import { CONSTANTS } from "../../../constants.js";
import { assert } from "../../../utils/Utils.js";
import { serviceSup } from "../../../utils/Supabase.js";

export const config = {
  runtime: "edge",
};
const VERSION = "v1";
const table_name = "companies";
const FORCE_REFETCH = false; // FOR TESTING
const getGPTDescriptions = async (
  companyName,
  companyUrl,
  crunchbaseDescription
) => {
  // retrieve cards for a specific company
  // cardName is an array
  // Providing crunchbaseDescription is optional.
  let systemPrompt;
  if (crunchbaseDescription) {
    systemPrompt = `You are a private equity analyst and have two tasks. Give a company called "${companyName}" with website url "${companyUrl}" and a description from Crunchbase: "${crunchbaseDescription}".`;
  } else {
    systemPrompt = `You are a private equity analyst and have two tasks. Given a company called "${companyName}" with website url "${companyUrl}",`;
  }
  systemPrompt += `\n\n1. What's the company description in 1 sentence. Keep it as concise as possible. Never include date or where it was founded. Crunchbase descriptions can be lacking in information or too verbose so please incorporate your knowledge to create a simple and focused description.\n
  2. Each point should describe distinct core revenue segments of the company, specifically how it makes money. Only the top 10% most complex companies should have 3 bullet points. List the largest revenue stream first and never list minor revenue streams.\n

  Return this as a JSON of with keys company_description and business_model. Bullet points for business_model should be representents as key value pairs.
`;

  const payload = {
    model: CONSTANTS.MODEL_VERSION,
    response_format: { type: "json_object" },
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
  };
  console.log("GPT REFETCH", payload);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const responseJSON = await res.json();
  // try {
  const content = responseJSON.choices[0].message.content.replace("\n", "");
  assert(
    content.includes("company_description") &&
      content.includes("business_model"),
    "Missing company_description or business_model"
  );
  return [content, payload];
};
// TODO: UNSECURE, add errors
const retrieveAndUpload = async (
  companyName,
  companyUrl,
  crunchbaseDescription,
  rows
) => {
  const [content, payload] =
    (await getGPTDescriptions(
      companyName,
      companyUrl,
      crunchbaseDescription
    )) || [];

  if (content) {
    const { data: bucketData, error: bucketError } = await serviceSup.storage
      .from("company_descriptions")
      .upload(
        `${VERSION}/${rows[0].id}.json`,
        JSON.stringify({ payload: payload, content: content }),
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (bucketError) {
      console.log("BUCKET ERROR", bucketError);
    }
    return content;
  }
};
const handler = async (req) => {
  const reqJSON = await req.json();
  const { companyName, crunchbaseDescription, companyUrl } = reqJSON;
  let { data: rows, error: error } = await serviceSup
    .from(table_name)
    .select()
    .eq("name", companyName);
  if (error || !rows || rows.length === 0) {
    const { data: insertedRows, error: insertedError } = await serviceSup
      .from(table_name)
      .insert({
        name: companyName,
        url: companyUrl,
      })
      .select();

    if (insertedError) {
      console.error("Error inserting data into cache:", insertedError);
      return; //TODO: make it return data. Left it like this so more apparent of cache errors for testing
    }
    const content = await retrieveAndUpload(
      companyName,
      companyUrl,
      crunchbaseDescription,
      insertedRows
    );
    return new Response(content);
  }

  const { data: gptContent, error: gptContentError } = await serviceSup.storage
    .from("company_descriptions")
    .download(`${VERSION}/${rows[0].id}.json`);
  const textGPTContent = await gptContent.text();
  const parsedGPTContent = JSON.parse(textGPTContent);
  if (gptContentError || !("content" in parsedGPTContent) || FORCE_REFETCH) {
    console.log(
      `${VERSION}/${rows[0].id}.json not in company_descriptions bucket`,
      gptContentError
    );
    console.log(crunchbaseDescription, "CB");
    const content = await retrieveAndUpload(
      companyName,
      companyUrl,
      crunchbaseDescription,
      rows
    );
    return new Response(content);
  }
  console.log("HI");
  return new Response(parsedGPTContent["content"]);
};

export default handler;
