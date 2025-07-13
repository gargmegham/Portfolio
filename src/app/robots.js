import config from "@/constants/config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `https://${config.domainName}/sitemap.xml`,
  };
}
