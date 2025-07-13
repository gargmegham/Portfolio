import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      const response = NextResponse.json({ error: "Email is required" }, { status: 400 });
      return response;
    }
    
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from("Newsletter Subscriber")
      .insert({ email });
      
    if (error) {
      const response = new Response(error.message ?? "Failed to subscribe", {
        status: 500,
      });
      return response;
    }
    const response = NextResponse.json({ message: "Subscribed successfully" });    
    return response;
  } catch (err) {
    const response = new Response(err.message ?? "Failed to subscribe", {
      status: 500,
    });    
    return response;
  }
}