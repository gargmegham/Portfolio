import config from "@/constants/config";

export const getSEOTags = ({
  title,
  description,
  keywords,
  canonicalUrlRelative,
  extraTags,
  openGraph,
  twitter,
  article,
}) => {
  const seoTitle = title ? `${title} | ${config.appName}` : config.appName;
  const seoDescription = description || config.appDescription;
  const seoKeywords = keywords || config.keywords.split(", ");
  const canonicalUrl = canonicalUrlRelative
    ? `https://${config.domainName}${canonicalUrlRelative}`
    : `https://${config.domainName}/`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    applicationName: config.appName,
    authors: [{ name: config.author.name, url: canonicalUrl }],
    creator: config.author.name,
    publisher: config.author.name,
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${config.domainName}/`,
    ),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: openGraph?.title || seoTitle,
      description: openGraph?.description || seoDescription,
      url: canonicalUrl,
      siteName: config.appName,
      locale: "en_US",
      type: openGraph?.type || "website",
      images:
        openGraph?.images ||
        `https://${config.domainName}/images/og-default.jpg`,
      ...(openGraph?.publishedTime && {
        publishedTime: openGraph.publishedTime,
      }),
      ...(openGraph?.modifiedTime && { modifiedTime: openGraph.modifiedTime }),
      ...(openGraph?.authors && { authors: openGraph.authors }),
      ...(openGraph?.tags && { tags: openGraph.tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: twitter?.title || seoTitle,
      description: twitter?.description || seoDescription,
      creator: config.author.twitter,
      images:
        twitter?.images ||
        openGraph?.images ||
        `https://${config.domainName}/images/og-default.jpg`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(article && {
      other: {
        ...(article.publishedTime && {
          "article:published_time": article.publishedTime,
        }),
        ...(article.modifiedTime && {
          "article:modified_time": article.modifiedTime,
        }),
        ...(article.authors?.length && {
          "article:author": article.authors.join(", "),
        }),
        ...(article.tags?.length && { "article:tag": article.tags.join(", ") }),
      },
    }),
    ...extraTags,
  };
};

export const generateBlogSEO = ({
  title,
  description,
  slug,
  tags,
  publishedAt,
  updatedAt,
  thumbnail,
}) => {
  const seoDescription = description.replace(/[#*`]/g, "").slice(0, 160);

  const seoTitle = title.slice(0, 60);

  return getSEOTags({
    title: seoTitle,
    description: seoDescription,
    keywords: tags,
    canonicalUrlRelative: `/blog/${slug}`,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      images:
        thumbnail || `https://${config.domainName}/images/blog-default.jpg`,
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: [config.author.name],
      tags: tags,
    },
    twitter: {
      title: seoTitle,
      description: seoDescription,
      images:
        thumbnail || `https://${config.domainName}/images/blog-default.jpg`,
    },
    article: {
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: [config.author.name],
      tags: tags,
    },
  });
};

export const generateBlogListingSEO = () => {
  return getSEOTags({
    title: "Blog",
    description:
      "Latest insights on software development, freelancing, and entrepreneurship. Tutorials, case studies, and practical advice for developers and entrepreneurs.",
    canonicalUrlRelative: "/logs",
    openGraph: {
      title: "Blog | Megham Garg",
      description:
        "Latest insights on software development, freelancing, and entrepreneurship.",
      type: "website",
      images: `https://${config.domainName}/images/blog-listing.jpg`,
    },
  });
};
