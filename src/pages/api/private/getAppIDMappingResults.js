import { serviceSup } from "../../../utils/Supabase.js";
export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  // Assuming the request body is JSON and Content-Type is application/json
  const reqJSON = await req.json();
  const { query } = reqJSON;
  let { data: resultRows, error: resultErrors } = await serviceSup
    .from("data_ai_mappings")
    .select()
    .or(
      `UNIFIED_PRODUCT_KEY.ilike.%${query}%,UNIFIED_PRODUCT_NAME.ilike.%${query}%`
    )
    .limit(40);

  if (resultErrors) {
    console.error("Error fetching Data AI Mappings:", resultErrors);
    return new Response(JSON.stringify([]), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(resultRows), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
