import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export const revalidate = 0;
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const supabase = getSupabaseServiceClient();

    const { data: blog, error } = await supabase
      .from("Blog")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      const response = NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
      return response;
    }

    if (!blog) {
      const response = NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
      return response;
    }

    const response = NextResponse.json(blog);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
    return response;
  }
}
