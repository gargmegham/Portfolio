import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const featured = searchParams.get("featured") === "true";

    const supabase = getSupabaseServiceClient();

    let query = supabase
      .from("Blog")
      .select(
        "id, title, slug, description, thumbnail, tags, featured, created_at",
        { count: "exact" },
      );

    // Apply filters
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    if (featured) {
      query = query.eq("featured", true);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data: blogs, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      blogs,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}
