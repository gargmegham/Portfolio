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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, slug, description, content, thumbnail, tags, featured } = await request.json();
    
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
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
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase
      .from("Blog")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}