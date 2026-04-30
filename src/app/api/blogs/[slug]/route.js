import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/utils/blogs";

export const revalidate = 0;
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const blog = getBlogBySlug(slug);

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
