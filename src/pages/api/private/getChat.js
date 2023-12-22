// getChat based on id. If not exist, null

import { serviceSupabase } from "../../../utils/Supabase.js";

export const config = {
  runtime: "edge",
};

const serviceSup = serviceSupabase();

// TODO: UNSECURE, add errors
const handler = async (req) => {
  // Extract the messages parameter from the request query
  // reqJSON.userId, reqJSON.messages
  const reqJSON = await req.json();
  const { userId, chatId } = reqJSON;

  const { data: messageData, error: messageError } = await serviceSup.storage
    .from("messages")
    .download(`${chatId}.json`);

  if (messageError) {
    console.log(messageError);
    return new Response(
      JSON.stringify({
        messages: [],
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  console.log(messageData);

  return new Response(messageData, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
