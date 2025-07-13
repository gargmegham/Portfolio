import { generateBlogListingSEO } from "@/utils/seo";

export const metadata = generateBlogListingSEO();

export default function BlogListingLayout({ children }) {
  return children;
}
