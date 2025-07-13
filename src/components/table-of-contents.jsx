"use client";

import React, { useState, useEffect } from "react";
import { extractHeadings, generateFlatToc } from "@/utils/markdown-parser";
import { cn } from "@/utils/cn";

/**
 * TableOfContents Component
 * Automatically generates a navigation menu from markdown headings
 */
const TableOfContents = ({
  content,
  className = "",
  minLevel = 2,
  maxLevel = 4,
  title = "Table of Contents",
  showTitle = true,
  sticky = false,
  collapsible = false,
}) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract headings from content
  useEffect(() => {
    if (content) {
      const extractedHeadings = extractHeadings(content);
      const tocItems = generateFlatToc(extractedHeadings, minLevel, maxLevel);
      setHeadings(tocItems);
    }
  }, [content, minLevel, maxLevel]);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((heading) => document.getElementById(heading.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100; // Offset for better UX

      // Find the heading that's currently in view
      let activeHeading = headingElements[0];

      for (const element of headingElements) {
        if (element.offsetTop <= scrollPosition) {
          activeHeading = element;
        } else {
          break;
        }
      }

      setActiveId(activeHeading.id);
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);

    if (element) {
      // Use modern scrollIntoView API for better compatibility
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      window.scrollBy(0, 180, "smooth");
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("toc-container", sticky && "sticky top-24", className)}
      aria-label="Table of Contents"
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm">
        {/* Header */}
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {title}
            </h3>

            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-amber-300 transition-colors p-1"
                aria-label={isCollapsed ? "Expand TOC" : "Collapse TOC"}
              >
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isCollapsed && "rotate-180"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* TOC List */}
        <div
          className={cn(
            "toc-list transition-all duration-300",
            isCollapsed && "max-h-0 overflow-hidden"
          )}
        >
          <ol className="space-y-1">
            {headings.map((heading, index) => {
              const isActive = heading.id === activeId;
              const indentClass = {
                0: "ml-0",
                1: "ml-4",
                2: "ml-8",
                3: "ml-12",
              }[Math.min(heading.indent, 3)];

              return (
                <li key={heading.id} className={cn("relative", indentClass)}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(heading.id);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                      "hover:bg-amber-400/10 hover:text-amber-300",
                      "focus:outline-none focus:ring-2 focus:ring-amber-400/50",
                      isActive
                        ? "bg-amber-400/20 text-amber-300 border-l-2 border-amber-400"
                        : "text-gray-300 border-l-2 border-transparent"
                    )}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span className="block truncate pr-2">{heading.text}</span>
                  </button>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 w-1 h-6 bg-amber-400 rounded-r-full transform -translate-y-1/2" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
};

/**
 * Compact inline TOC component for mobile or space-constrained layouts
 */
export const CompactTOC = ({ content, className = "", maxItems = 5 }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (content) {
      const extractedHeadings = extractHeadings(content);
      const tocItems = generateFlatToc(extractedHeadings, 2, 3);
      setHeadings(tocItems.slice(0, maxItems));
    }
  }, [content, maxItems]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "compact-toc bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 mb-6",
        className
      )}
    >
      <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        In this article:
      </h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => {
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="text-left text-sm text-gray-300 hover:text-amber-300 transition-colors"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
