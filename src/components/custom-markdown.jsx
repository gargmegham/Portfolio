"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/utils/cn";
import "katex/dist/katex.min.css";

const CustomMarkdown = ({ content, className = "" }) => {
  const customComponents = {
    // Headings with amber gradient accents
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl md:text-4xl font-bold mb-6 mt-8 first:mt-0 bg-gradient-to-r from-amber-400 via-amber-300 to-white bg-clip-text text-transparent leading-tight"
        {...props}
      >
        {children}
      </h1>
    ),

    h2: ({ children, ...props }) => (
      <h2
        className="text-2xl md:text-3xl font-bold mb-5 mt-8 text-white relative"
        {...props}
      >
        <span className="relative">
          {children}
          <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></span>
        </span>
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3
        className="text-xl md:text-2xl font-semibold mb-4 mt-6 text-white relative"
        {...props}
      >
        <span className="relative">
          {children}
          <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></span>
        </span>
      </h3>
    ),

    h4: ({ children, ...props }) => (
      <h4
        className="text-lg md:text-xl font-semibold mb-3 mt-5 text-amber-300"
        {...props}
      >
        {children}
      </h4>
    ),

    h5: ({ children, ...props }) => (
      <h5
        className="text-base md:text-lg font-semibold mb-3 mt-4 text-amber-400"
        {...props}
      >
        {children}
      </h5>
    ),

    h6: ({ children, ...props }) => (
      <h6
        className="text-sm md:text-base font-semibold mb-2 mt-4 text-amber-500 uppercase tracking-wide"
        {...props}
      >
        {children}
      </h6>
    ),

    // Paragraphs with proper spacing
    p: ({ children, ...props }) => (
      <p
        className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg"
        {...props}
      >
        {children}
      </p>
    ),

    // Links with amber styling
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-amber-400 hover:text-amber-300 transition-colors duration-300 relative inline-flex items-center gap-1 group no-underline"
        {...props}
      >
        <span className="relative">
          {children}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
        </span>
        <svg
          className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    ),

    // Code blocks and inline code
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");

      if (!inline && match) {
        return (
          <div className="relative my-6 group">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-medium rounded-bl-lg border-l border-b border-amber-400/30">
              {match[1]}
            </div>
            <SyntaxHighlighter
              style={{
                ...tomorrow,
                'pre[class*="language-"]': {
                  ...tomorrow['pre[class*="language-"]'],
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(251, 191, 36, 0.1)",
                  borderRadius: "1rem",
                  backdropFilter: "blur(12px)",
                },
                'code[class*="language-"]': {
                  ...tomorrow['code[class*="language-"]'],
                  background: "transparent",
                },
              }}
              language={match[1]}
              PreTag="div"
              className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="px-2 py-1 bg-amber-400/10 text-amber-300 rounded-md text-sm font-mono border border-amber-400/20"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-amber-400 bg-amber-400/5 backdrop-blur-sm pl-6 pr-4 py-4 my-6 italic text-gray-300 rounded-r-lg relative"
        {...props}
      >
        <div className="absolute top-2 left-2 text-amber-400/30 text-2xl font-serif">
          &ldquo;
        </div>
        {children}
      </blockquote>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="relative list-none space-y-2 mb-4 ml-4" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol
        className="relative list-none space-y-2 mb-4 ml-4 counter-reset-list"
        {...props}
      >
        {children}
      </ol>
    ),

    li: ({ children, ordered, ...props }) => {
      // Check if this is a task list item (contains checkbox)
      const hasCheckbox =
        typeof children === "object" &&
        Array.isArray(children) &&
        children.some(
          (child) =>
            child?.type === "input" && child?.props?.type === "checkbox"
        );

      if (hasCheckbox) {
        return (
          <li
            className="text-gray-300 relative mb-2 flex items-start gap-3"
            {...props}
          >
            {children}
          </li>
        );
      }

      return (
        <li
          className={cn(
            "text-gray-300 relative pl-6 mb-2",
            ordered ? "counter-increment-list" : ""
          )}
          {...props}
        >
          {ordered ? (
            <span className="absolute left-0 top-0 w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center counter-content"></span>
          ) : (
            <span className="absolute left-0 top-[0.6rem] w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></span>
          )}
          {children}
        </li>
      );
    },

    // GitHub-style task list checkboxes
    input: ({ type, checked, disabled, ...props }) => {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className={cn(
              "w-4 h-4 mt-1 rounded border-2 transition-all duration-200 cursor-pointer",
              checked
                ? "bg-amber-400 border-amber-400 text-black"
                : "bg-transparent border-gray-400 hover:border-amber-400",
              disabled && "cursor-not-allowed opacity-50"
            )}
            readOnly={disabled}
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    },

    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table
          className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
          {...props}
        >
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead
        className="bg-amber-400/10 border-b border-amber-400/20"
        {...props}
      >
        {children}
      </thead>
    ),

    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left text-amber-300 font-semibold text-sm"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 text-gray-300 border-b border-white/5 text-sm"
        {...props}
      >
        {children}
      </td>
    ),

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr
        className="my-8 border-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        {...props}
      />
    ),

    // Images
    img: ({ src, alt, ...props }) => (
      <div className="my-6 group">
        <img
          src={src}
          alt={alt || "Image"}
          className="w-full rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-amber-400/30 group-hover:shadow-2xl group-hover:shadow-amber-500/10"
          crossOrigin="anonymous"
          loading="lazy"
          onError={(e) => {
            e.target.style.border = "2px dashed #f59e0b";
            e.target.style.background = "#451a03";
            e.target.style.color = "#f59e0b";
            e.target.style.padding = "2rem";
            e.target.style.textAlign = "center";
            e.target.alt = `Failed to load: ${src}`;
          }}
          {...props}
        />
        {alt && (
          <p className="text-center text-gray-500 text-sm mt-2 italic">{alt}</p>
        )}
      </div>
    ),

    // Strong/Bold
    strong: ({ children, ...props }) => (
      <strong className="font-bold text-white" {...props}>
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ children, ...props }) => (
      <em className="italic text-amber-200" {...props}>
        {children}
      </em>
    ),

    // Keyboard input
    kbd: ({ children, ...props }) => (
      <kbd
        className="px-2 py-1 bg-gray-700 text-amber-300 rounded-md text-sm font-mono border border-gray-600 shadow-sm"
        {...props}
      >
        {children}
      </kbd>
    ),

    // Details/Summary (collapsible)
    details: ({ children, ...props }) => (
      <details
        className="my-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        {...props}
      >
        {children}
      </details>
    ),

    summary: ({ children, ...props }) => (
      <summary
        className="px-4 py-3 bg-amber-400/10 text-amber-300 font-medium cursor-pointer hover:bg-amber-400/20 transition-colors border-b border-white/10"
        {...props}
      >
        {children}
      </summary>
    ),

    // Definition lists
    dl: ({ children, ...props }) => (
      <dl className="my-6 space-y-4" {...props}>
        {children}
      </dl>
    ),

    dt: ({ children, ...props }) => (
      <dt className="font-semibold text-amber-300 mb-1" {...props}>
        {children}
      </dt>
    ),

    dd: ({ children, ...props }) => (
      <dd
        className="ml-4 text-gray-300 border-l-2 border-amber-400/30 pl-4"
        {...props}
      >
        {children}
      </dd>
    ),

    // Enhanced iframe support
    iframe: ({
      src,
      title,
      width,
      height,
      frameBorder,
      allowFullScreen,
      ...props
    }) => {
      // Fix YouTube URLs - convert watch URLs to embed URLs
      let embedSrc = src;
      if (src && src.includes("youtube.com/watch")) {
        const videoId = src.split("v=")[1]?.split("&")[0];
        if (videoId) {
          embedSrc = `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (src && src.includes("youtu.be/")) {
        const videoId = src.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) {
          embedSrc = `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return (
        <div className="my-6 relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
          <iframe
            src={embedSrc}
            title={title || "Embedded content"}
            width={width || "100%"}
            height={height || "400"}
            frameBorder={frameBorder || "0"}
            allowFullScreen={
              allowFullScreen !== undefined ? allowFullScreen : true
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full"
            style={{
              aspectRatio: width && height ? `${width}/${height}` : "16/9",
            }}
            {...props}
          />
        </div>
      );
    },

    // Superscript/Subscript
    sup: ({ children, ...props }) => (
      <sup className="text-amber-400 text-xs" {...props}>
        {children}
      </sup>
    ),

    sub: ({ children, ...props }) => (
      <sub className="text-amber-400 text-xs" {...props}>
        {children}
      </sub>
    ),

    // Strikethrough
    del: ({ children, ...props }) => (
      <del className="line-through text-gray-500" {...props}>
        {children}
      </del>
    ),
  };

  return (
    <div className={cn("prose-custom max-w-none", className)}>
      <style>{`
        .counter-reset-list {
          counter-reset: list-counter;
        }
        .counter-increment-list {
          counter-increment: list-counter;
        }
        .counter-content::before {
          content: counter(list-counter);
        }

        /* Custom checkbox styling for task lists */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          background-color: transparent;
          border: 2px solid #9ca3af;
          border-radius: 0.25rem;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          flex-shrink: 0;
        }

        input[type="checkbox"]:hover {
          border-color: #fbbf24;
        }

        input[type="checkbox"]:checked {
          background-color: #fbbf24;
          border-color: #fbbf24;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
          background-size: 80% 80%;
          background-position: center;
          background-repeat: no-repeat;
        }

        input[type="checkbox"]:checked:hover {
          background-color: #f59e0b;
          border-color: #f59e0b;
        }

        input[type="checkbox"]:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Task list specific styling */
        .prose-custom ul li:has(input[type="checkbox"]) {
          list-style: none;
          padding-left: 0;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .prose-custom ul li:has(input[type="checkbox"]) p {
          margin: 0;
          flex: 1;
        }

        /* Math rendering improvements */
        .katex {
          font-size: 1.1em;
        }

        .katex-display {
          margin: 1.5rem 0;
          text-align: center;
        }
      `}</style>
      <ReactMarkdown
        components={customComponents}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
          [
            rehypeSanitize,
            {
              tagNames: [
                "div",
                "span",
                "p",
                "br",
                "strong",
                "em",
                "u",
                "s",
                "del",
                "strike",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "dl",
                "dt",
                "dd",
                "table",
                "thead",
                "tbody",
                "tr",
                "th",
                "td",
                "blockquote",
                "pre",
                "code",
                "a",
                "img",
                "iframe",
                "details",
                "summary",
                "kbd",
                "sup",
                "sub",
                "hr",
                "input",
              ],
              attributes: {
                "*": ["className", "style", "id"],
                a: ["href", "title", "target", "rel"],
                img: ["src", "alt", "title", "width", "height", "style"],
                iframe: [
                  "src",
                  "title",
                  "width",
                  "height",
                  "frameBorder",
                  "allowFullScreen",
                  "allow",
                  "style",
                ],
                details: ["open"],
                pre: ["className"],
                code: ["className"],
                th: ["align"],
                td: ["align"],
                input: ["type", "checked", "disabled"],
              },
              protocols: {
                href: ["http", "https", "mailto", "tel"],
                src: ["http", "https", "data"],
                cite: ["http", "https"],
              },
              allowProtocolRelative: true,
              strip: ["script"],
              stripIgnoreTag: false,
              stripIgnoreTagBody: ["script"],
              allowVulnerableTags: false,
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default CustomMarkdown;
