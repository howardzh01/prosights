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
  const { userId } = reqJSON;

  // const { data: profileData, error: profileError } = await serviceSup
  //   .from("profiles")
  //   .select()
  //   .eq("id", userId);

  const { data: profileData, error: profileError } = await serviceSup
    .from("profiles")
    .upsert({ id: userId }, { ignooreDuplicates: true })
    .select();

  if (profileError) {
    return new Response(
      JSON.stringify({
        chatsData: [],
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { data: userChatData, error: userChatError } = await serviceSup
    .from("chats")
    .select()
    .in("id", profileData[0].chat_ids);

  return new Response(JSON.stringify({ chatsData: userChatData }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handler;
