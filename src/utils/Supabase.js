import { createClient } from "@supabase/supabase-js";
// import { tab } from "@testing-library/user-event/dist/types/convenience";
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

export async function cachedFetch({
  url,
  options,
  customFetchFunction = null, // if you want to use a different fetch function. form: fetch(url, options)
  serviceSup,
  responseFormat = "json",
  tableName,
}) {
  const cacheKey = url.toString() + JSON.stringify(options);

  let { data: rows, error: error } = await serviceSup
    .from(tableName)
    .select()
    .eq("query", cacheKey);
  // console.log("Pre-fetch Supabase INFO", rows, error);

  if (error || !rows || rows.length === 0) {
    if (error) {
      console.log("Initial Fetch Error", error);
    }
    let new_response;
    if (customFetchFunction) {
      new_response = await customFetchFunction(url, options); // can be null
    } else {
      new_response = await fetch(url, options);
    }
    if (!new_response) {
      console.log("1ch Error with undefined new_response", url.toString());
      return;
    }
    if (!new_response.ok) {
      // console.log(
      //   "cachedFetch Error",
      //   url.toString(),
      //   new_response.status,
      //   new_response.statusText
      // );
      return;
    }
    let data;
    if (responseFormat === "json") {
      data = JSON.stringify(await new_response.json());
    } else if (responseFormat === "text") {
      data = await new_response.text();
      if (data.includes("ERROR")) {
        // semrush will sometimes output ERRORs as strings
        return;
      }
    } else {
      return;
    }

    if (!data || data.length === 0) {
      return;
    }

    const { error: insertError } = await serviceSup.from(tableName).insert({
      query: cacheKey,
      response: data,
    });

    if (insertError) {
      console.error("Error inserting data into cache:", insertError);
      return data; // TODO: buggy here where insert error should never happen
    }
    return data;
  }

  return rows[0].response;
}

export async function cachedBucketFetch({
  url,
  options,
  customFetchFunction = null, // if you want to use a different fetch function. form: fetch(url, options)
  serviceSup,
  responseFormat = "json",
  table_name,
}) {
  const topLevelBucketName = "api_calls";
  const cacheKey = url.toString() + JSON.stringify(options);

  let { data: rows, error: error } = await serviceSup
    .from(table_name)
    .select()
    .eq("query", cacheKey);
  console.log("Pre-fetch Supabase INFO", rows, error);
  let new_response;

  if (error || !rows || rows.length === 0) {
    if (error) {
      console.error("Initial BucketFetch Error", error);
    }

    let data;
    // fetch data below
    if (customFetchFunction) {
      const jsonData = await customFetchFunction(url, options); // can be undefined
      if (!jsonData) return;
      data = JSON.stringify(jsonData);
    } else {
      new_response = await fetch(url, options);
      if (!new_response.ok) {
        console.log(
          "cachedFetchBucket Error",
          url.toString(),
          new_response.status,
          new_response.statusText
        );
        return;
      }

      if (responseFormat === "json") {
        data = JSON.stringify(await new_response.json());
      } else if (responseFormat === "text") {
        data = await new_response.text();
        if (data.includes("ERROR")) {
          // semrush will sometimes output ERRORs as strings
          return;
        }
      } else {
        return;
      }
    }

    if (!data || data.length === 0) {
      return;
    }

    const { data: insertData, error: insertError } = await serviceSup
      .from(table_name)
      .insert({
        query: cacheKey,
        data_preview: data.slice(0, 100), // for debugging only
      })
      .select();

    if (insertError) {
      console.error("Error inserting data into cache:", insertError);
      return; //TODO: make it return data. Left it like this so more apparent of cache errors for testing
    }

    const { data: bucketData, error: bucketError } = await serviceSup.storage
      .from(topLevelBucketName)
      .upload(`${table_name}/${insertData[0].id}.json`, data, {
        cacheControl: "3600",
        upsert: true,
      });

    if (bucketError) {
      console.log("BUCKET ERROR", bucketError);
    }

    return data;
  }
  const { data: apiCallData, error: apiCallError } = await serviceSup.storage
    .from(topLevelBucketName)
    .download(`${table_name}/${rows[0].id}.json`);

  if (apiCallError) {
    console.log(`${table_name}/${rows[0].id}.json not in bucket`, apiCallError);
    return;
  }
  return await apiCallData.text();
}
