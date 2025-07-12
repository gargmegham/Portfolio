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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}
