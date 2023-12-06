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
  const { userId, messages, chatId } = reqJSON;
  let finalChatId = chatId;
  console.log(chatId);

  if (!chatId) {
    const { data: chatData, error: chatError } = await serviceSup
      .from("chats")
      .insert({})
      .select();

    const { data: profileData, error: profileError } = await serviceSup
      .from("profiles")
      .select()
      .eq("id", userId);

    const { data: updateProfileData, error: updateProfileError } =
      await serviceSup
        .from("profiles")
        .update({ chat_ids: [...profileData[0].chat_ids, chatData[0].id] })
        .select()
        .eq("id", userId);
    finalChatId = chatData[0].id;
  }

  console.log(messages);

  const { data, error } = await serviceSup.storage
    .from("messages")
    .upload(`${finalChatId}.json`, JSON.stringify({ messages: messages }), {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.log(error);
  }

  return new Response(
    JSON.stringify({
      chatId: finalChatId,
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
