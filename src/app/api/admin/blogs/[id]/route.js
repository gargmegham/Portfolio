import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/utils/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabaseServiceClient();

    const { data: blog, error } = await supabase
      .from("Blog")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, slug, description, content, thumbnail, tags, featured } =
      await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceClient();

    const { data: blog, error } = await supabase
      .from("Blog")
      .update({
        title,
        slug,
        description: description || "",
        content,
        thumbnail: thumbnail || "",
        tags: tags || [],
        featured: featured || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase blog update error:", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabaseServiceClient();

    // First, fetch the blog post to get thumbnail URL
    const { data: blog, error: fetchError } = await supabase
      .from("Blog")
      .select("thumbnail")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete the blog post from database
    const { error: deleteError } = await supabase.from("Blog").delete().eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // If there's a thumbnail, delete it from storage
    if (blog?.thumbnail) {
      try {
        // Extract filename from URL
        // Thumbnail URLs are typically: https://[project-id].supabase.co/storage/v1/object/public/blog-images/gallery/[filename]
        const url = new URL(blog.thumbnail);
        const pathParts = url.pathname.split('/');
        const filename = pathParts[pathParts.length - 1];
        
        // Only delete if it looks like it's from our gallery (has timestamp format)
        if (filename && filename.includes('-') && filename.includes('.')) {
          const { error: storageError } = await supabase.storage
            .from("blog-images")
            .remove([`gallery/${filename}`]);

          if (storageError) {
            console.error("Failed to delete thumbnail from storage:", storageError);
            // Don't fail the entire operation if thumbnail deletion fails
          }
        }
      } catch (thumbnailError) {
        console.error("Error processing thumbnail deletion:", thumbnailError);
        // Don't fail the entire operation if thumbnail deletion fails
      }
    }

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
