import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      const response = NextResponse.json(
        { error: "No file uploaded" },
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const response = NextResponse.json(
        { error: "Only image files are allowed" },
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const response = NextResponse.json(
        { error: "File size must be less than 5MB" },
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `blog-thumbnails/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload to Supabase Storage
    const supabase = getSupabaseServiceClient();

    // Try to create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(
      (bucket) => bucket.name === "blog-images",
    );

    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket(
        "blog-images",
        {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
        },
      );

      if (bucketError) {
        console.error("Failed to create bucket:", bucketError);
        const response = NextResponse.json(
          { error: "Failed to create storage bucket" },
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

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      const response = NextResponse.json(
        { error: `Failed to upload to storage: ${uploadError.message}` },
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

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(filename);

    const response = NextResponse.json({ url: publicUrl }, { status: 200 });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Upload error:", error);
    const response = NextResponse.json(
      { error: "Failed to upload file" },
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
