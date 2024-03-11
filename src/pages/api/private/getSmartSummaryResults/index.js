import { CONSTANTS } from "../../../../constants.js";
import { assert } from "../../../../utils/Utils.js";
import { serviceSup } from "../../../../utils/Supabase.js";
import { systemPrompt } from "./prompts.js";

export const config = {
  runtime: "edge",
};
const BUCKET_VERSION = "v2";
const FORCE_REFETCH = false; // FOR TESTING

const getSmartSummaryResults = async (
  companyName,
  usersAssetQuality,
  mobilePercentage,
  organicWebTrafficQuality,
  ltmOrganicPercentage,
  directWebTrafficQuality,
  ltmDirectPercentage,
  geographyWebTrafficQuality,
  largestShare,
  userTimeQuality,
  ltmTimeUsage,
  m6RetentionQuality,
  ltmM6Retention,
  netAssetQualityScore,
  m6RetentionMomentum,
  retentionYearPercentageChange,
  headcountMomentum,
  headcountYearPercentageChange,
  trafficMomentum,
  trafficYearPercentageChange,
  appDownloadsMomentum,
  appYearPercentageChange,
  userTimeMomentum,
  usersYearPercentageChange,
  netMomentumScore,
  overallScore
) => {
  const payload = {
    model: CONSTANTS.MODEL_VERSION,
    response_format: { type: "json_object" },
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: systemPrompt(
          companyName,
          usersAssetQuality,
          mobilePercentage,
          organicWebTrafficQuality,
          ltmOrganicPercentage,
          directWebTrafficQuality,
          ltmDirectPercentage,
          geographyWebTrafficQuality,
          largestShare,
          userTimeQuality,
          ltmTimeUsage,
          m6RetentionQuality,
          ltmM6Retention,
          netAssetQualityScore,
          m6RetentionMomentum,
          retentionYearPercentageChange,
          headcountMomentum,
          headcountYearPercentageChange,
          trafficMomentum,
          trafficYearPercentageChange,
          appDownloadsMomentum,
          appYearPercentageChange,
          userTimeMomentum,
          usersYearPercentageChange,
          netMomentumScore,
          overallScore
        ),
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
  return [content, payload];
};

// TODO: UNSECURE, add errors
const retrieveAndUpload = async (
  companyName,
  usersAssetQuality,
  mobilePercentage,
  organicWebTrafficQuality,
  ltmOrganicPercentage,
  directWebTrafficQuality,
  ltmDirectPercentage,
  geographyWebTrafficQuality,
  largestShare,
  userTimeQuality,
  ltmTimeUsage,
  m6RetentionQuality,
  ltmM6Retention,
  netAssetQualityScore,
  m6RetentionMomentum,
  retentionYearPercentageChange,
  headcountMomentum,
  headcountYearPercentageChange,
  trafficMomentum,
  trafficYearPercentageChange,
  appDownloadsMomentum,
  appYearPercentageChange,
  userTimeMomentum,
  usersYearPercentageChange,
  netMomentumScore,
  overallScore,
  rows
) => {
  const [content, payload] =
    (await getSmartSummaryResults(
      companyName,
      usersAssetQuality,
      mobilePercentage,
      organicWebTrafficQuality,
      ltmOrganicPercentage,
      directWebTrafficQuality,
      ltmDirectPercentage,
      geographyWebTrafficQuality,
      largestShare,
      userTimeQuality,
      ltmTimeUsage,
      m6RetentionQuality,
      ltmM6Retention,
      netAssetQualityScore,
      m6RetentionMomentum,
      retentionYearPercentageChange,
      headcountMomentum,
      headcountYearPercentageChange,
      trafficMomentum,
      trafficYearPercentageChange,
      appDownloadsMomentum,
      appYearPercentageChange,
      userTimeMomentum,
      usersYearPercentageChange,
      netMomentumScore,
      overallScore
    )) || [];

  if (content) {
    const { data: bucketData, error: bucketError } = await serviceSup.storage
      .from("company_smart_summaries")
      .upload(`${rows[0].id}.json`, JSON.stringify({ content: content }), {
        cacheControl: "3600",
        upsert: true,
      });

    if (bucketError) {
      console.log("BUCKET ERROR", bucketError);
    }
    return content;
  }
};

const handler = async (req) => {
  const reqJSON = await req.json();
  const {
    companyName,
    usersAssetQuality,
    mobilePercentage,
    organicWebTrafficQuality,
    ltmOrganicPercentage,
    directWebTrafficQuality,
    ltmDirectPercentage,
    geographyWebTrafficQuality,
    largestShare,
    userTimeQuality,
    ltmTimeUsage,
    m6RetentionQuality,
    ltmM6Retention,
    netAssetQualityScore,
    m6RetentionMomentum,
    retentionYearPercentageChange,
    headcountMomentum,
    headcountYearPercentageChange,
    trafficMomentum,
    trafficYearPercentageChange,
    appDownloadsMomentum,
    appYearPercentageChange,
    userTimeMomentum,
    usersYearPercentageChange,
    netMomentumScore,
    overallScore,
  } = reqJSON;

  // Using company_descriptions_v2 table for company IDs
  // Note that this may be problematic since each company has different IDs in multiple different tables
  const table_name = `company_descriptions_${BUCKET_VERSION}`;
  let { data: rows, error: error } = await serviceSup
    .from(table_name)
    .select()
    .eq("name", companyName);
  if (error || !rows || rows.length === 0) {
    const { data: insertedRows, error: insertedError } = await serviceSup
      .from(table_name)
      .insert({
        name: companyName,
        url: null,
      })
      .select();

    if (insertedError) {
      console.error("Error inserting data into cache:", insertedError);
      return; //TODO: make it return data. Left it like this so more apparent of cache errors for testing
    }

    const content = await retrieveAndUpload(
      companyName,
      usersAssetQuality,
      mobilePercentage,
      organicWebTrafficQuality,
      ltmOrganicPercentage,
      directWebTrafficQuality,
      ltmDirectPercentage,
      geographyWebTrafficQuality,
      largestShare,
      userTimeQuality,
      ltmTimeUsage,
      m6RetentionQuality,
      ltmM6Retention,
      netAssetQualityScore,
      m6RetentionMomentum,
      retentionYearPercentageChange,
      headcountMomentum,
      headcountYearPercentageChange,
      trafficMomentum,
      trafficYearPercentageChange,
      appDownloadsMomentum,
      appYearPercentageChange,
      userTimeMomentum,
      usersYearPercentageChange,
      netMomentumScore,
      overallScore,
      insertedRows
    );
    return new Response(content);
  }

  const { data: gptContent, error: gptContentError } = await serviceSup.storage
    .from("company_smart_summaries")
    .download(`${rows[0].id}.json`);

  if (gptContentError || FORCE_REFETCH) {
    console.log(
      `${rows[0].id}.json not in company_smart_summaries bucket or because REFETCHED is ${FORCE_REFETCH}`,
      gptContentError
    );
    const content = await retrieveAndUpload(
      companyName,
      usersAssetQuality,
      mobilePercentage,
      organicWebTrafficQuality,
      ltmOrganicPercentage,
      directWebTrafficQuality,
      ltmDirectPercentage,
      geographyWebTrafficQuality,
      largestShare,
      userTimeQuality,
      ltmTimeUsage,
      m6RetentionQuality,
      ltmM6Retention,
      netAssetQualityScore,
      m6RetentionMomentum,
      retentionYearPercentageChange,
      headcountMomentum,
      headcountYearPercentageChange,
      trafficMomentum,
      trafficYearPercentageChange,
      appDownloadsMomentum,
      appYearPercentageChange,
      userTimeMomentum,
      usersYearPercentageChange,
      netMomentumScore,
      overallScore,
      rows
    );

    return new Response(content);
  }
  const textGPTContent = await gptContent.text();
  const parsedGPTContent = JSON.parse(textGPTContent);
  return new Response(parsedGPTContent?.["content"] || "");
};

export default handler;
