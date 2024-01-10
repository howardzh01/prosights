import { CONSTANTS } from "../../../constants.js";

export const config = {
  runtime: "edge",
};

// TODO: UNSECURE, add errors
const handler = async (req) => {
  const reqJSON = await req.json();
  const { companyName, crunchbaseDescription } = reqJSON;
  return new Response(crunchbaseDescription);

  const payload = {
    model: CONSTANTS.MODEL_VERSION,
    messages: [
      {
        role: "system",
        content: `Here is the description of the company "${companyName}" by Crunchbase: "${crunchbaseDescription}".

    Using this information and what you know, give me a 2 sentence description of ${companyName} in layman terms so that anyone can understand what the company does:`,
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

  return new Response(responseJSON.choices[0].message.content);
};

export default handler;
