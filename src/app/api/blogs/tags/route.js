import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request) {
  try {
    const supabase = getSupabaseServiceClient();
    const { data: blogs, error } = await supabase.from("Blog").select("tags");
    if (error) {
      const response = NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
      return response;
    }
    // Aggregate all tags and count their frequency
    const tagCounts = {};
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    // Sort tags by frequency and return top 10
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    const response = NextResponse.json(topTags);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
    return response;
  }
}
