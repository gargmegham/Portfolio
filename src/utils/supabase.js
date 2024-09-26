import { createClient } from "@supabase/supabase-js";

/**
 * @description Get the Supabase Service Client, this can bypass row level security
 * @param key
 * @returns SupabaseClient
 */
export const getSupabaseServiceClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Supabase environment variables are not set");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};
