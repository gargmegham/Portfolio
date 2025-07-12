import { MetadataRoute } from "next";
import config from "@/constants/config";
import { getSupabaseServiceClient } from "@/utils/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = getSupabaseServiceClient();

    const { data: blogs, error } = await supabase
      .from("Blog")
      .select("slug, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs for sitemap:", error);
      return [];
    }

    return blogs.map((blog) => ({
      url: `https://${config.domainName}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating blog sitemap:", error);
    return [];
  }
}
