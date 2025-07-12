import { MetadataRoute } from "next";
import config from "@/constants/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `https://${config.domainName}/sitemap.xml`,
  };
}
