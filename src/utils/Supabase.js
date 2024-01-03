import { createClient } from "@supabase/supabase-js";
// import { CONSTANTS } from "../../constants";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  //   { auth: { persistSession: CONSTANTS.SUPABASE_PERSIST_SESSION } }
);

export const serviceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
    // { auth: { persistSession: CONSTANTS.SUPABASE_PERSIST_SESSION } }
  );
};

export const serviceSup = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
  // { auth: { persistSession: CONSTANTS.SUPABASE_PERSIST_SESSION } }
);

export async function cachedFetch(
  url,
  options,
  serviceSup,
  responseFormat = "json"
) {
  const cacheKey = url.toString() + JSON.stringify(options);

  let { data: rows, error: error } = await serviceSup
    .from("api_calls")
    .select()
    .eq("query", cacheKey);
  console.log(rows, error);

  if (error || !rows || rows.length === 0) {
    const new_response = await fetch(url, options);
    if (!new_response.ok) {
      console.log(
        "cachedFetch Error",
        url,
        new_response.status,
        new_response.statusText
      );
      return;
    }
    let data;
    if (responseFormat === "json") {
      data = JSON.stringify(await new_response.json());
    } else if (responseFormat === "text") {
      data = await new_response.text();
    } else {
      return;
    }

    const { error: insertError } = await serviceSup.from("api_calls").insert({
      query: cacheKey,
      response: data,
    });

    if (insertError) {
      console.error("Error inserting data into cache:", insertError);
      return;
    }
    return data;
  }
  console.log("HIT CACHE");
  return rows[0].response;
}
