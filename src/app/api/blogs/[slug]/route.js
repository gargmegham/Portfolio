import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

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
        { status: 500 },
      );

      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");

      return response;
    }

    if (!blog) {
      const response = NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );

      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");

      return response;
    }

    const response = NextResponse.json(blog);

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  }
}
