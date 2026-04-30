import { NextResponse } from "next/server";
import { queryBlogs } from "@/utils/blogs";

export const revalidate = 0;
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const featured = searchParams.get("featured") === "true";

    const response = NextResponse.json(
      queryBlogs({
        page,
        limit,
        search,
        tag,
        featured,
      }),
    );

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );

    return response;
  }
}
