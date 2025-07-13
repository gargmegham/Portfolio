import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function DELETE(request, { params }) {
  try {
    const { filename } = params;

    if (!filename) {
      const response = NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
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

    const supabase = getSupabaseServiceClient();

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from("blog-images")
      .remove([`gallery/${filename}`]);

    if (error) {
      console.error("Gallery delete error:", error);
      const response = NextResponse.json(
        { error: "Failed to delete image" },
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

    const response = NextResponse.json({
      message: "Image deleted successfully",
      filename,
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Gallery delete API error:", error);
    const response = NextResponse.json(
      { error: "Failed to delete image" },
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
