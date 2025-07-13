import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request) {
  try {
    const supabase = getSupabaseServiceClient();

    const { data: subscribers, error } = await supabase
      .from("Newsletter Subscriber")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const response = NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
      return response;
    }
    const response = NextResponse.json(subscribers);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
    return response;
  }
}
