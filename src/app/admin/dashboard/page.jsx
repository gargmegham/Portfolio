"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [blogSearch, setBlogSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch blogs
      const blogsResponse = await fetch("/api/admin/blogs");
      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      }

      // Fetch subscribers
      const subscribersResponse = await fetch("/api/admin/subscribers");
      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json();
        setSubscribers(subscribersData);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Logged out successfully");
      router.push("/admin");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(blogSearch.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email?.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen p-6">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "blogs"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "subscribers"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Subscribers
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "blogs" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
                <button
                  onClick={() => router.push("/admin/blogs/new")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  New Post
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredBlogs.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-8 text-center text-gray-400"
                          >
                            No blog posts found
                          </td>
                        </tr>
                      ) : (
                        filteredBlogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 text-white">
                              {blog.title}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Published
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {blog.featured ? (
                                <span className="text-yellow-400">★</span>
                              ) : (
                                <span className="text-gray-400">☆</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {new Date(blog.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    router.push(`/admin/blogs/edit/${blog.id}`)
                                  }
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  Edit
                                </button>
                                <button className="text-red-400 hover:text-red-300">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscribers" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Subscribers
              </h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search subscribers by email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-white font-medium">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredSubscribers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-8 text-center text-gray-400"
                          >
                            No subscribers found
                          </td>
                        </tr>
                      ) : (
                        filteredSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 text-white">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {new Date(
                                subscriber.created_at
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
