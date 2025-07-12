"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [blogSearch, setBlogSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
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

      // Fetch gallery images
      const galleryResponse = await fetch("/api/admin/gallery");
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        setGalleryImages(galleryData.images);
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.uploaded.length > 0) {
          toast.success(`Uploaded ${result.uploaded.length} image(s) successfully!`);
          // Refresh gallery
          const galleryResponse = await fetch("/api/admin/gallery");
          if (galleryResponse.ok) {
            const galleryData = await galleryResponse.json();
            setGalleryImages(galleryData.images);
          }
        }
        if (result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    
    if (files.length === 0) {
      toast.error("Please drop image files only");
      return;
    }

    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.uploaded.length > 0) {
          toast.success(`Uploaded ${result.uploaded.length} image(s) successfully!`);
          // Refresh gallery
          const galleryResponse = await fetch("/api/admin/gallery");
          if (galleryResponse.ok) {
            const galleryData = await galleryResponse.json();
            setGalleryImages(galleryData.images);
          }
        }
        if (result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleImagePreview = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleImageDelete = async (filename) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/${filename}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Image deleted successfully");
        // Refresh gallery
        const galleryResponse = await fetch("/api/admin/gallery");
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          setGalleryImages(galleryData.images);
        }
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };

  const copyMarkdownSyntax = (image) => {
    const markdown = `![${image.name}](${image.url})`;
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown syntax copied to clipboard!");
  };

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
            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "gallery"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Gallery
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

          {activeTab === "gallery" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Image Gallery</h2>
                <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-6 text-center transition-colors hover:border-emerald-500"
              >
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-lg font-medium">Drop images here or click to upload</p>
                  <p className="text-sm">Support for JPEG, PNG, WebP, GIF up to 5MB each</p>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.name} className="group relative bg-gray-800 rounded-lg overflow-hidden aspect-square">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleImagePreview(image)}
                          className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          title="Preview & Copy URL"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleImageDelete(image.name)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          title="Delete Image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Image info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      <p className="text-xs truncate" title={image.name}>{image.name}</p>
                      <p className="text-xs text-gray-300">{(image.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>

              {galleryImages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">No images in gallery</p>
                  <p className="text-sm">Upload some images to get started</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-w-full max-h-96 object-contain mx-auto rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filename</label>
                  <p className="text-white bg-gray-700 px-3 py-2 rounded">{selectedImage.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={selectedImage.url}
                      readOnly
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm"
                    />
                    <button
                      onClick={() => copyImageUrl(selectedImage.url)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Markdown Syntax</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={`![${selectedImage.name}](${selectedImage.url})`}
                      readOnly
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm font-mono"
                    />
                    <button
                      onClick={() => copyMarkdownSyntax(selectedImage)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Copy Markdown
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="font-medium">Size:</span> {(selectedImage.size / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <span className="font-medium">Uploaded:</span> {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleImageDelete(selectedImage.name);
                    setShowImageModal(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
