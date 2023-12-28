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
