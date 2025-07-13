"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogListing() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentPosts, setRecentPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [subscriberEmail, setSubscriberEmail] = useState("");

  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    // Read URL parameters when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get("search");
    const urlTag = urlParams.get("tag");

    if (urlSearch) {
      setSearch(urlSearch);
    }
    if (urlTag) {
      setSelectedTag(urlTag);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
    fetchRecentPosts();
    fetchFeaturedPosts();
  }, [currentPage, search, selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: POSTS_PER_PAGE.toString(),
        ...(search && { search }),
        ...(selectedTag && { tag: selectedTag }),
      });

      const response = await fetch(`/api/blogs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/blogs/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
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

  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch("/api/blogs?featured=true&limit=5");
      if (response.ok) {
        const data = await response.json();
        setFeaturedPosts(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch featured posts:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setCurrentPage(1);
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

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-dot-white/[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10" />

        <main className="relative z-10 px-6 md:px-12 lg:px-24 py-36">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-t from-amber-500 via-amber-300 to-white bg-clip-text text-transparent mb-6">
                Blog Posts
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
                Discover actionable insights, proven strategies, and real-world
                experiences
                <span className="text-amber-400 font-medium">
                  {" "}
                  from the trenches of tech
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  Software Development
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  Freelancing & Business
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  Career Growth
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 max-w-[100rem] mx-auto">
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search blog posts..."
                    className="w-full px-6 py-4 pl-14 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
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

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedTag === tag
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-amber-400/20 hover:to-amber-500/20 hover:text-amber-400 hover:border-amber-400/30 backdrop-blur-sm border border-white/10"
                      }`}
                    >
                      {tag}{" "}
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
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
                      Loading Posts
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Fetching the latest insights for you...
                    </p>
                  </div>

                  {/* Loading skeleton cards */}
                  <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden animate-pulse"
                      >
                        <div className="h-40 bg-gradient-to-r from-white/5 via-amber-400/10 to-white/5"></div>
                        <div className="p-6">
                          <div className="flex gap-2 mb-4">
                            <div className="w-12 h-4 bg-amber-400/20 rounded-full"></div>
                            <div className="w-16 h-4 bg-amber-400/20 rounded-full"></div>
                          </div>
                          <div className="w-4/5 h-6 bg-white/10 rounded mb-4"></div>
                          <div className="space-y-2 mb-4">
                            <div className="w-full h-3 bg-white/5 rounded"></div>
                            <div className="w-3/4 h-3 bg-white/5 rounded"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="w-20 h-3 bg-white/5 rounded"></div>
                            <div className="w-16 h-4 bg-amber-400/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
                    {blogs.map((blog) => (
                      <Link href={`/blog/${blog.slug}`} key={blog.id}>
                        <article className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-black/60 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                          {blog.thumbnail && (
                            <div className="relative h-40 overflow-hidden">
                              <Image
                                src={blog.thumbnail}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {blog.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 text-xs bg-white/10 text-gray-300 rounded-full border border-white/10 backdrop-blur-sm hover:bg-amber-400/10 hover:text-amber-400 hover:border-amber-400/20 transition-all duration-300"
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

                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors leading-tight">
                              {blog.title}
                            </h2>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {blog.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {new Date(blog.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-white hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-all duration-300 group-hover:gap-2 relative">
                                Read More
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg backdrop-blur-sm"
                                : "bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-amber-400/20 hover:to-amber-500/20 hover:text-amber-400 hover:border-amber-400/30 backdrop-blur-sm border border-white/10"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/4 space-y-8">
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
                      className="block group relative"
                    >
                      <h4 className="text-sm text-white group-hover:text-amber-400 transition-colors leading-relaxed relative">
                        {post.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-300 group-hover:w-full"></span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Featured Posts
                  </h3>
                  <div className="space-y-4">
                    {featuredPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group relative"
                      >
                        <h4 className="text-sm text-white group-hover:text-amber-400 transition-colors leading-relaxed relative">
                          {post.title}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-300 group-hover:w-full"></span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
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
                <p className="text-sm text-gray-400 mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
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
        </main>
      </div>
    </>
  );
}
