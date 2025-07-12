import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function DELETE(request, { params }) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceClient();

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from("blog-images")
      .remove([`gallery/${filename}`]);

    if (error) {
      console.error("Gallery delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Image deleted successfully",
      filename,
    });
  } catch (error) {
    console.error("Gallery delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
