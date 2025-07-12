import type { Metadata } from "next";
import { generateBlogListingSEO } from "@/utils/seo";

export const metadata: Metadata = generateBlogListingSEO();

export default function BlogListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
