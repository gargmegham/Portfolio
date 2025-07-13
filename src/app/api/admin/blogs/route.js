import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request) {
  try {
    const supabase = getSupabaseServiceClient();

    const { data: blogs, error } = await supabase
      .from("Blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const response = NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
      return response;
    }
    const response = NextResponse.json(blogs);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
    return response;
  }
}

export async function POST(request) {
  try {
    const {
      title,
      slug,
      description,
      content,
      thumbnail,
      tags,
      featured,
      draft,
    } = await request.json();

    if (!title || !slug || !content) {
      const response = NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
      return response;
    }

    const supabase = getSupabaseServiceClient();

    const { data: blog, error } = await supabase
      .from("Blog")
      .insert({
        title,
        slug,
        description: description || "",
        content,
        thumbnail: thumbnail || "",
        tags: tags || [],
        featured: featured || false,
        draft: draft || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase blog creation error:", error);
      const response = NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      );
      return response;
    }
    const response = NextResponse.json(blog, { status: 201 });
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
    return response;
  }
}
