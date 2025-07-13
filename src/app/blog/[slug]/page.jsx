"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomMarkdown from "@/components/custom-markdown";
import config from "@/constants/config";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaReddit,
  FaWhatsapp,
  FaCopy,
} from "react-icons/fa";

export default function BlogPost({ params }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlog();
    fetchRecentPosts();
  }, [params.slug]);

  useEffect(() => {
    if (blog?.tags?.length > 0) {
      fetchRelatedPosts();
    }
  }, [blog]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        router.push("/logs");
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      router.push("/logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch("/api/blogs?limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentPosts(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch recent posts:", error);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!blog?.tags?.length) return;

    try {
      const response = await fetch(`/api/blogs?tag=${blog.tags[0]}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        // Filter out current post
        const filtered = data.blogs.filter((post) => post.id !== blog.id);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch related posts:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/logs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail }),
      });

      if (response.ok) {
        setSubscriberEmail("");
        alert("Successfully subscribed to newsletter!");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      alert("Failed to subscribe. Please try again.");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = blog ? `Check out this blog post: ${blog.title}` : "";

  const shareButtons = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      color: "text-blue-700",
    },
    {
      name: "Reddit",
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(blog?.title || "")}`,
      color: "text-orange-600",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`,
      color: "text-green-500",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = (blog) => {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.description,
      image:
        blog.thumbnail ||
        `https://${config.domainName}/images/blog-default.jpg`,
      datePublished: blog.created_at,
      dateModified: blog.updated_at || blog.created_at,
      author: {
        "@type": "Person",
        name: config.author.name,
        url: `https://${config.domainName}`,
        sameAs: [
          config.socials.twitter,
          config.socials.linkedin,
          config.socials.github,
        ].filter(Boolean),
      },
      publisher: {
        "@type": "Person",
        name: config.author.name,
        logo: {
          "@type": "ImageObject",
          url: `https://${config.domainName}/images/me.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://${config.domainName}/blog/${blog.slug}`,
      },
      keywords: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      url: `https://${config.domainName}/blog/${blog.slug}`,
      ...(blog.featured && {
        isPartOf: {
          "@type": "Blog",
          name: `${config.appName} Blog`,
          url: `https://${config.domainName}/logs`,
        },
      }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-dot-white/[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10" />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-12 lg:px-24">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-t from-amber-400 via-amber-300 to-white bg-clip-text text-transparent mb-3">
              Loading Post
            </h3>
            <p className="text-gray-400 text-sm">
              Preparing your reading experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-dot-white/[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10" />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-12 lg:px-24">
          <div className="text-center">
            <h3 className="text-2xl font-semibold bg-gradient-to-t from-amber-400 via-amber-300 to-white bg-clip-text text-transparent mb-4">
              Post Not Found
            </h3>
            <p className="text-gray-400 mb-6">
              The blog post you are looking for does not exist or has been
              removed.
            </p>
            <Link
              href="/logs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black rounded-xl font-medium transition-all duration-300"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(blog)),
        }}
      />

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-dot-white/[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10" />

        <main className="relative z-10 px-6 md:px-12 lg:px-24 py-36">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 max-w-[100rem] mx-auto">
              {/* Main Content */}
              <article className="lg:w-3/4">
                {/* Blog Header */}
                <header className="mb-8">
                  <Link
                    href="/logs"
                    className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <span className="transition-transform group-hover:-translate-x-1">
                      ←
                    </span>
                    <span className="relative">
                      Back to Blogs
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>

                  {blog.thumbnail && (
                    <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 hover:bg-amber-400/30 hover:text-amber-200 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.featured && (
                      <span className="px-2.5 py-0.5 text-xs bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300 rounded-full border border-amber-400/30">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {blog.title}
                  </h1>

                  <div className="flex items-center text-gray-400 text-sm mb-6">
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    {blog.updated_at && blog.updated_at !== blog.created_at && (
                      <span className="ml-4">
                        Updated:{" "}
                        {new Date(blog.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {blog.description && (
                    <p className="text-lg text-gray-300 mb-8">
                      {blog.description}
                    </p>
                  )}
                </header>

                {/* Blog Content */}
                <CustomMarkdown content={blog.content} className="mb-8" />

                {/* Share Buttons */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Share this post
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {shareButtons.map((button) => (
                      <a
                        key={button.name}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-amber-400/10 hover:border-amber-400/30 rounded-xl transition-all duration-300"
                      >
                        <button.icon size={16} />
                        <span className="text-sm text-white">
                          {button.name}
                        </span>
                      </a>
                    ))}
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-amber-400/10 hover:border-amber-400/30 rounded-xl transition-all duration-300 text-gray-300 hover:text-amber-400"
                    >
                      <FaCopy size={16} />
                      <span className="text-sm text-white">Copy Link</span>
                    </button>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:w-1/4 space-y-8">
                {/* Search */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Search Posts
                  </h3>
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search blog posts..."
                        className="w-full px-6 py-4 pl-14 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all duration-300"
                      />
                      <svg
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </form>
                </div>

                {/* Recent Posts */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Posts
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm text-white group-hover:text-amber-400 transition-colors leading-relaxed relative">
                          {post.title}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-300 group-hover:w-full"></span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* More Like This */}
                {relatedPosts.length > 0 && (
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      More Like This
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="block group"
                        >
                          <h4 className="text-sm text-white group-hover:text-amber-400 transition-colors leading-relaxed relative">
                            {post.title}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-300 group-hover:w-full"></span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter Subscription */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Subscribe to Newsletter
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get the latest posts delivered right to your inbox.
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm relative overflow-hidden group"
                    >
                      <span className="relative z-10">Subscribe</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
