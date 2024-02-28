import { CONSTANTS } from "../../../constants.js";
import { assert } from "../../../utils/Utils.js";
import { serviceSup } from "../../../utils/Supabase.js";

export const config = {
  runtime: "edge",
};
const BUCKET_VERSION = "v2";
const FORCE_REFETCH = true; // FOR TESTING

const getGPTDescriptions = async (
  companyName,
  companyUrl,
  crunchbaseDescription,
  category
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
  if (category === "companyDescription") {
    systemPrompt += `\n\nWhat's the company description in 1 sentence. Keep it as concise as possible. Never include date or where it was founded. Crunchbase descriptions can be lacking in information or too verbose so please incorporate your knowledge to create a simple and focused description. Return in json form with key value pair "${category}" and the value as the description.`;
  } else {
    systemPrompt += `\n\n What is the business model? Each point should describe distinct core revenue segments of the company, specifically how it makes money. Only the top 10% most complex companies should have 3 bullet points each 1 sentence. List the largest revenue stream first and never list minor revenue streams.  Return this as a JSON of with key "${category}". Bullet points for business_model should be representented where key has spaces between words and value is the revenue stream. Do not say "I do not have access to future data" and try your best`;
  }
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
  // return content;
  assert(content.includes(category), `GPT JSON missing ${category}`);
  return [content, payload];
};
// TODO: UNSECURE, add errors
const retrieveAndUpload = async (
  companyName,
  companyUrl,
  crunchbaseDescription,
  rows,
  category
) => {
  const [content, payload] =
    (await getGPTDescriptions(
      companyName,
      companyUrl,
      crunchbaseDescription,
      category
    )) || [];

  if (content) {
    const { data: bucketData, error: bucketError } = await serviceSup.storage
      .from("company_descriptions")
      .upload(
        `${BUCKET_VERSION}/${category}/${rows[0].id}.json`,
        JSON.stringify({ content: content }),
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
  const { companyName, crunchbaseDescription, companyUrl, category } = reqJSON; //type is either companyDescription or businessModel
  if (category !== "companyDescription" && category !== "businessModel") {
    return new Response("Invalid type", { status: 400 });
  }
  const table_name =
    category === "companyDescription"
      ? `company_descriptions_${BUCKET_VERSION}`
      : `business_models_${BUCKET_VERSION}`;
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
      insertedRows,
      category
    );
    return new Response(content);
  }

  const { data: gptContent, error: gptContentError } = await serviceSup.storage
    .from("company_descriptions")
    .download(`${BUCKET_VERSION}/${category}/${rows[0].id}.json`);

  if (gptContentError || FORCE_REFETCH) {
    console.log(
      `${BUCKET_VERSION}/${category}/${rows[0].id}.json not in company_descriptions bucket or REFETCHED`,
      gptContentError
    );
    const content = await retrieveAndUpload(
      companyName,
      companyUrl,
      crunchbaseDescription,
      rows,
      category
    );
    return new Response(content);
  }
  const textGPTContent = await gptContent.text();
  const parsedGPTContent = JSON.parse(textGPTContent);
  return new Response(parsedGPTContent?.["content"] || "");
};

export default handler;
