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
    <main className="bg-grid-small-white/[0.4] px-4 md:px-8 lg:px-20 py-36">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog Posts
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Insights on software development, freelancing, and entrepreneurship
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blog posts..."
                  className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
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
              <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {tag} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            {loading ? (
              <div className="text-center text-white py-12">Loading...</div>
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-2">
                  {blogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="group bg-gray-50/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-50/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                    >
                      {blog.thumbnail && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-emerald-600/20 text-emerald-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-600/20 text-yellow-400 rounded-full">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                          {blog.title}
                        </h2>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {blog.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(blog.created_at).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
          <aside className="lg:w-1/3 space-y-8">
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

            {/* Featured Posts */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Featured Posts</h3>
              <div className="space-y-4">
                {featuredPosts.map((post) => (
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
