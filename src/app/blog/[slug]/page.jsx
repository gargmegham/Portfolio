"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
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
        const filtered = data.blogs.filter(post => post.id !== blog.id);
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
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-700",
    },
    {
      name: "Reddit",
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog?.title || "")}`,
      color: "text-orange-600",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: "text-green-500",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Blog post not found</div>
      </div>
    );
  }

  return (
    <main className="bg-grid-small-white/[0.4] px-4 md:px-8 lg:px-20 py-36">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="lg:w-2/3">
            {/* Blog Header */}
            <header className="mb-8">
              <Link
                href="/logs"
                className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block"
              >
                ← Back to Blog
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
                    className="px-3 py-1 text-sm bg-emerald-600/20 text-emerald-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {blog.featured && (
                  <span className="px-3 py-1 text-sm bg-yellow-600/20 text-yellow-400 rounded-full">
                    ★ Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {blog.title}
              </h1>

              <div className="flex items-center text-gray-400 text-sm mb-6">
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                {blog.updated_at && blog.updated_at !== blog.created_at && (
                  <span className="ml-4">
                    Updated: {new Date(blog.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {blog.description && (
                <p className="text-lg text-gray-300 mb-8">{blog.description}</p>
              )}
            </header>

            {/* Blog Content */}
            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Share this post</h3>
              <div className="flex flex-wrap gap-4">
                {shareButtons.map((button) => (
                  <a
                    key={button.name}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors ${button.color}`}
                  >
                    <button.icon size={16} />
                    <span className="text-sm text-white">{button.name}</span>
                  </a>
                ))}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                >
                  <FaCopy size={16} />
                  <span className="text-sm text-white">Copy Link</span>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Search */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Search Posts</h3>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blog posts..."
                    className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <h4 className="text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {post.title}
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
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">More Like This</h3>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {post.title}
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
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Subscribe to Newsletter</h3>
              <p className="text-sm text-gray-300 mb-4">
                Get the latest posts delivered right to your inbox.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}