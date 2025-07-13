import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const supabase = getSupabaseServiceClient();

    // List files from gallery folder
    const { data: files, error } = await supabase.storage
      .from("blog-images")
      .list("gallery", {
        limit: limit,
        offset: (page - 1) * limit,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Gallery fetch error:", error);
      const response = NextResponse.json(
        { error: "Failed to fetch gallery images" },
        { status: 500 },
      );
      return response;
    }

    // Generate public URLs for each image
    const images = files.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("blog-images")
        .getPublicUrl(`gallery/${file.name}`);

      return {
        id: file.id,
        name: file.name,
        url: publicUrl,
        size: file.metadata?.size || 0,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
      };
    });

    const response = NextResponse.json({
      images,
      page,
      hasMore: files.length === limit,
    });
    return response;
  } catch (error) {
    console.error("Gallery API error:", error);
    const response = NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 },
    );
    return response;
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const files = data.getAll("files");

    if (!files || files.length === 0) {
      const response = NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 },
      );
      return response;
    }

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
        return response;
      }
    }

    const uploadedImages = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: Only image files are allowed`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: File size must be less than 5MB`);
          continue;
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split(".").pop();
        const randomString = Math.random().toString(36).substring(2);
        const filename = `${timestamp}-${randomString}.${fileExtension}`;
        const fullPath = `gallery/${filename}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fullPath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          errors.push(`${file.name}: Upload failed - ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("blog-images").getPublicUrl(fullPath);

        uploadedImages.push({
          originalName: file.name,
          filename,
          url: publicUrl,
          size: file.size,
          type: file.type,
        });
      } catch (fileError) {
        errors.push(`${file.name}: ${fileError.message}`);
      }
    }

    const response = NextResponse.json({
      success: uploadedImages.length > 0,
      uploaded: uploadedImages,
      errors: errors,
    });
    return response;
  } catch (error) {
    console.error("Gallery upload error:", error);
    const response = NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 },
    );
    return response;
  }
}
