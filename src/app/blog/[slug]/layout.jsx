import config from "@/constants/config";
import { generateBlogSEO } from "@/utils/seo";
import { getBlogBySlug } from "@/utils/blogs";

export async function generateMetadata({ params }, parent) {
  const { slug } = params;

  try {
    const blog = getBlogBySlug(slug);
    if (!blog) {
      throw new Error("Blog post not found");
    }

    const {
      title,
      description,
      tags = [],
      created_at,
      updated_at,
      thumbnail,
    } = blog;

    return generateBlogSEO({
      title,
      description: description || `Read ${title} on ${config.appName}`,
      slug,
      tags: Array.isArray(tags) ? tags : [],
      publishedAt: created_at,
      updatedAt: updated_at,
      thumbnail,
    });
  } catch (error) {
    console.error("Error generating blog metadata:", error);

    // Fallback metadata
    const defaultTitle = "Blog Post";
    const defaultDescription = `Read the latest insights on software development, freelancing, and entrepreneurship from ${config.author.name}.`;

    return generateBlogSEO({
      title: defaultTitle,
      description: defaultDescription,
      slug,
      tags: ["blog", "software development", "freelancing"],
      publishedAt: new Date().toISOString(),
    });
  }
}

export default function BlogPostLayout({ children }) {
  return children;
}
