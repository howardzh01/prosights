// getChat based on id. If not exist, null

import { serviceSup } from "../../../utils/Supabase.js";

export const config = {
  runtime: "edge",
};

// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  const reqJSON = await req.json();
  const { userId, companyNameList, country } = reqJSON;

  // const { data: profileData, error: profileError } = await serviceSup
  //   .from("profiles")
  //   .select()
  //   .eq("id", userId);

  // Fetch companies that match the companyNameList and were added in the last 24 hours
  const { data: recentCompanies, error: recentCompaniesError } =
    await serviceSup
      .from("api_usage")
      .select()
      .eq("user_id", userId) // Ensure the company is associated with the specific userId
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      ); // Added in the last 24 hours
  if (recentCompaniesError) {
    console.error("Error fetching recent companies:", recentCompaniesError);
    return new Response(
      JSON.stringify({
        apiUsage: null,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  let filteredRecentCompanies = recentCompanies || [];
  // Remove duplicates of (company_name, country)
  // from the recentCompanies list if exists (possibly due to race condition)
  filteredRecentCompanies = filteredRecentCompanies.filter(
    (company, index, self) => {
      return (
        index ===
        self.findIndex(
          (t) =>
            t.company_name === company.company_name &&
            t.country === company.country
        )
      );
    }
  );
  // Filter out companies that are already in the database from the companyNameList
  const newCompanies = companyNameList.filter((companyName) => {
    if (!filteredRecentCompanies) return true;
    else {
      return !filteredRecentCompanies.some(
        (company) =>
          company.company_name === companyName && company.country === country
      );
    }
  });
  // Append new companies to the database
  if (newCompanies.length > 0) {
    const newCompaniesData = newCompanies.map((companyName) => ({
      user_id: userId,
      company_name: companyName,
      country: country,
    }));
    const { data: insertedCompanies, error: insertError } = await serviceSup
      .from("api_usage")
      .insert(newCompaniesData);

    if (insertError) {
      console.error("Error inserting new companies:", insertError);
    }
  }

  return new Response(
    JSON.stringify({
      apiUsage: newCompanies.length + (filteredRecentCompanies?.length || 0),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export default handler;
