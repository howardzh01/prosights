import { serviceSup } from "../../../utils/Supabase.js";
export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  // Assuming the request body is JSON and Content-Type is application/json
  const reqJSON = await req.json();
  const { query } = reqJSON;
  let { data: urlRows, error: urlErrors } = await serviceSup
    .from("mappings_v2")
    .select()
    .or(`url.ilike.%${query}%,displayedName.ilike.%${query}%`)
    .limit(40);

  if (urlErrors) {
    console.error("Error fetching companies:", urlErrors);
    return new Response(JSON.stringify([]), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(urlRows), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
