# MeghamGarg.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/0ac14488-7759-4c6a-b5e5-56c2cdce12cf/deploy-status)](https://app.netlify.com/sites/meghamgarg/deploys)

Modern portfolio + blog built with Next.js App Router, custom UI components, and 3D interactions.

## What This Repo Includes

- Interactive portfolio sections with motion and 3D models.
- Markdown-powered blog (`/logs` listing + `/blog/[slug]` detail).
- Local file-based blog content in `content/blogs/*.md`.
- Local blog thumbnails in `public/blog-thumbnails/*`.
- SEO metadata and sitemap generation for both site pages and blog posts.

## Current Blog Architecture

Blogs are no longer stored in Supabase.

- Source of truth: Markdown files in `content/blogs`.
- Metadata: frontmatter in the same `.md` file.
- Body: Markdown content below frontmatter.
- Thumbnails: static files under `public/blog-thumbnails` referenced as `/blog-thumbnails/<file>`.
- Data access: server-side filesystem helpers in `src/utils/blogs.js`.

### Frontmatter Format

```md
---
title: "Post Title"
slug: "post-title"
description: "Short summary for list + SEO"
thumbnail: "/blog-thumbnails/post-thumbnail.png"
tags:
  - "AI"
  - "Engineering"
featured: false
draft: false
created_at: "2026-04-30T00:00:00.000Z"
updated_at: "2026-04-30T00:00:00.000Z"
---

# Post Heading
Markdown body...
```

## Project Structure

```text
portfolio/
├── content/
│   └── blogs/                 # Markdown blog posts with frontmatter
├── public/
│   ├── blog-thumbnails/       # Local blog thumbnail assets
│   ├── images/
│   └── models/
├── src/
│   ├── app/
│   │   ├── api/blogs/         # Public blog APIs (file-based)
│   │   ├── blog/              # Blog detail routes
│   │   ├── logs/              # Blog listing route
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   ├── constants/
│   ├── ui/
│   └── utils/
│       ├── blogs.js           # File-based blog loader/query utilities
│       ├── seo.js
│       └── markdown-parser.js
├── next.config.mjs
├── package.json
└── tailwind.config.ts
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Only analytics/third-party keys are needed for normal runtime. Example:

```env
NEXT_PUBLIC_GA4=your_ga4_id
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy

Deploy on Vercel or Netlify using the standard Next.js build/start flow.

## License

MIT
