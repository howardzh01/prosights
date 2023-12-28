export const dateToQuarters = (date) => {
  // Convert Date object 2023-01-01 to 1Q23
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const quarterString = `${quarter}Q${date.getFullYear().toString().slice(2)}`;
  return quarterString;
};

export const generateMonths = (startYear) => {
  const dates = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    let endMonth = year === currentYear ? today.getMonth() : 12;
    for (let month = 1; month <= endMonth; month++) {
      // Pad the month with a leading zero if necessary
      const monthString = String(month).padStart(2, "0");
      dates.push(`${year}-${monthString}-01`);
    }
  }
  return dates;
};

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
      console.log("cachedFetch Error", url, new_response.status);
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
