"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchWithNoCache } from "@/utils/api";

export default function EditBlogPost({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    tags: "",
    featured: false,
    draft: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetchBlogPost();
  }, []);

  useEffect(() => {
    if (showGalleryModal) {
      fetchGalleryImages();
    }
  }, [showGalleryModal]);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetchWithNoCache("/api/admin/gallery");
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    }
  };

  const insertImageIntoContent = (image) => {
    const markdown = `![${image.name}](${image.url})`;
    const textarea = document.getElementById("content");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      formData.content.substring(0, start) +
      markdown +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));
    setShowGalleryModal(false);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + markdown.length,
        start + markdown.length,
      );
    }, 100);
  };

  const fetchBlogPost = async () => {
    try {
      const response = await fetchWithNoCache(`/api/admin/blogs/${params.id}`);
      if (response.ok) {
        const blog = await response.json();
        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          description: blog.description || "",
          content: blog.content || "",
          thumbnail: blog.thumbnail || "",
          tags: blog.tags ? blog.tags.join(", ") : "",
          featured: blog.featured || false,
          draft: blog.draft || false,
        });
        // Set thumbnail preview if existing thumbnail
        if (blog.thumbnail) {
          setThumbnailPreview(blog.thumbnail);
        }
      } else {
        toast.error("Failed to load blog post");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load blog post");
      router.push("/admin/dashboard");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) {
      console.log(
        "No new thumbnail file, returning existing:",
        formData.thumbnail,
      );
      return formData.thumbnail; // Keep existing thumbnail if no new file
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", thumbnailFile);

    try {
      const response = await fetchWithNoCache("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
    }
    return formData.thumbnail; // Fallback to existing thumbnail
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Upload thumbnail if new file provided
      const thumbnailUrl = await uploadThumbnail();

      const response = await fetchWithNoCache(`/api/admin/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl,
          tags: tagsArray,
        }),
      });

      if (response.ok) {
        toast.success("Blog post updated successfully!");
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update blog post");
      }
    } catch (error) {
      toast.error("Failed to update blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetchWithNoCache(`/api/admin/blogs/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Blog post deleted successfully!");
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete blog post");
      }
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Delete Post
            </button>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Slug (auto-generated)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                readOnly
                className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 cursor-not-allowed"
                placeholder="Auto-generated from title"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Brief description of the blog post"
            />
          </div>

          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {thumbnailPreview && (
              <div className="mt-4">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full max-w-sm h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="react, javascript, web development"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                Content (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setShowGalleryModal(true)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                📷 Browse Images
              </button>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={20}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              placeholder="Write your blog content in Markdown..."
              required
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-300"
              >
                Mark as featured post
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="draft"
                name="draft"
                checked={formData.draft}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
              />
              <label
                htmlFor="draft"
                className="text-sm font-medium text-gray-300"
              >
                Save as draft
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-6xl max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Choose Image from Gallery
                </h3>
                <button
                  onClick={() => setShowGalleryModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                {galleryImages.map((image) => (
                  <div
                    key={image.name}
                    onClick={() => insertImageIntoContent(image)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        insertImageIntoContent(image);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Insert image ${image.name}`}
                    className="group relative bg-gray-700 rounded-lg overflow-hidden aspect-square cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Insert
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {galleryImages.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>
                    No images in gallery. Upload some images first in the
                    Gallery tab.
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
