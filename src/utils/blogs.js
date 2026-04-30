import fs from "node:fs";
import path from "node:path";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

const parseScalar = (rawValue) => {
  const value = rawValue.trim();

  if (value === "true") return true;
  if (value === "false") return false;

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }

  return value;
};

const parseFrontmatter = (rawMarkdown) => {
  if (!rawMarkdown.startsWith("---")) {
    return { data: {}, content: rawMarkdown };
  }

  const match = rawMarkdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: rawMarkdown };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const data = {};
  let activeArrayKey = null;

  const lines = frontmatterBlock.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    if (activeArrayKey && /^\s*-\s+/.test(line)) {
      const arrayItem = line.replace(/^\s*-\s+/, "");
      const existing = Array.isArray(data[activeArrayKey]) ? data[activeArrayKey] : [];
      existing.push(String(parseScalar(arrayItem)));
      data[activeArrayKey] = existing;
      continue;
    }

    activeArrayKey = null;

    const keyValueMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!keyValueMatch) {
      continue;
    }

    const key = keyValueMatch[1];
    const value = keyValueMatch[2];

    if (value === "") {
      data[key] = [];
      activeArrayKey = key;
      continue;
    }

    data[key] = parseScalar(value);
  }

  return { data, content };
};

const normalizeString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const normalizeBoolean = (value) => {
  return value === true;
};

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .filter((tag, index, all) => all.indexOf(tag) === index);
  }
  return [];
};

const isValidDateString = (value) => {
  return !Number.isNaN(Date.parse(value));
};

const normalizeDate = (value, fallback) => {
  if (typeof value === "string" && isValidDateString(value)) {
    return new Date(value).toISOString();
  }

  if (isValidDateString(fallback)) {
    return new Date(fallback).toISOString();
  }

  return new Date().toISOString();
};

const normalizeSlug = (value, fallback) => {
  const rawSlug = normalizeString(value) || fallback;
  return rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

const slugToTitle = (slug) => {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const safeReadBlogsDir = () => {
  if (!fs.existsSync(BLOGS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOGS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name);
};

const readAllBlogFiles = () => {
  const filenames = safeReadBlogsDir();

  return filenames
    .map((filename) => {
      const fullPath = path.join(BLOGS_DIR, filename);
      const fileRaw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = parseFrontmatter(fileRaw);
      const fileStats = fs.statSync(fullPath);

      const fallbackSlug = path.basename(filename, path.extname(filename));
      const slug = normalizeSlug(data.slug, fallbackSlug);
      if (!slug) {
        return null;
      }

      const createdAt = normalizeDate(data.created_at, fileStats.birthtime.toISOString());
      const updatedAt = normalizeDate(data.updated_at, fileStats.mtime.toISOString());

      return {
        id: normalizeString(data.id) || slug,
        title: normalizeString(data.title) || slugToTitle(slug),
        slug,
        description: normalizeString(data.description),
        content: content.trim(),
        thumbnail: normalizeString(data.thumbnail),
        tags: normalizeTags(data.tags),
        featured: normalizeBoolean(data.featured),
        draft: normalizeBoolean(data.draft),
        created_at: createdAt,
        updated_at: updatedAt,
      };
    })
    .filter(Boolean)
    .sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at));
};

export const getAllBlogs = ({ includeDrafts = false } = {}) => {
  const posts = readAllBlogFiles();
  if (includeDrafts) {
    return posts;
  }

  return posts.filter((post) => !post.draft);
};

export const getBlogBySlug = (slug, { includeDrafts = false } = {}) => {
  const posts = getAllBlogs({ includeDrafts });
  return posts.find((post) => post.slug === slug);
};

export const queryBlogs = ({
  page = 1,
  limit = 10,
  search = "",
  tag = "",
  featured = false,
  includeDrafts = false,
} = {}) => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;

  let posts = getAllBlogs({ includeDrafts });

  if (search) {
    const loweredSearch = search.toLowerCase();
    posts = posts.filter((post) => post.title.toLowerCase().includes(loweredSearch));
  }

  if (tag) {
    posts = posts.filter((post) => post.tags.includes(tag));
  }

  if (featured) {
    posts = posts.filter((post) => post.featured);
  }

  const total = posts.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit;

  const blogs = posts.slice(from, to).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    thumbnail: post.thumbnail,
    tags: post.tags,
    featured: post.featured,
    created_at: post.created_at,
  }));

  return {
    blogs,
    total,
    page: safePage,
    totalPages,
  };
};

export const getTopTags = (limit = 10) => {
  const tagCounts = new Map();

  getAllBlogs().forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((left, right) => {
      if (right[1] === left[1]) {
        return left[0].localeCompare(right[0]);
      }
      return right[1] - left[1];
    })
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
};
