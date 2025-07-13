/**
 * Utility functions for parsing markdown content and extracting headings
 */

/**
 * Converts heading text to a URL-friendly ID
 * Mimics the behavior of remark-heading-id plugin exactly
 */
export function generateHeadingId(text) {
  return text
    .toLowerCase()
    .trim()
    // Replace quotes and other punctuation
    .replace(/[""''`]/g, '') // Remove quotes
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extracts headings from markdown content
 * Returns an array of heading objects with text, level, and id
 */
export function extractHeadings(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Number of # characters
    const text = match[2].trim();
    
    // Check if heading has custom ID syntax {#custom-id}
    const customIdMatch = text.match(/^(.+?)\s*\{#([^}]+)\}$/);
    
    let headingText, id;
    if (customIdMatch) {
      headingText = customIdMatch[1].trim();
      id = customIdMatch[2];
    } else {
      headingText = text;
      id = generateHeadingId(text);
    }

    headings.push({
      level,
      text: headingText,
      id,
      anchor: `#${id}`
    });
  }

  return headings;
}

/**
 * Builds a hierarchical table of contents structure
 * Groups headings by their nesting level
 */
export function buildTocHierarchy(headings) {
  if (!headings || headings.length === 0) {
    return [];
  }

  const toc = [];
  const stack = [];

  headings.forEach(heading => {
    const item = {
      ...heading,
      children: []
    };

    // Find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Top level item
      toc.push(item);
    } else {
      // Child item
      stack[stack.length - 1].children.push(item);
    }

    stack.push(item);
  });

  return toc;
}

/**
 * Filters headings by level range
 * Useful for creating TOC with only specific heading levels
 */
export function filterHeadingsByLevel(headings, minLevel = 1, maxLevel = 6) {
  return headings.filter(heading => 
    heading.level >= minLevel && heading.level <= maxLevel
  );
}

/**
 * Generates a flat list of TOC items with indentation info
 * Useful for simple TOC rendering without nested components
 */
export function generateFlatToc(headings, minLevel = 2, maxLevel = 4) {
  const filtered = filterHeadingsByLevel(headings, minLevel, maxLevel);
  
  return filtered.map(heading => ({
    ...heading,
    indent: heading.level - minLevel, // 0-based indentation level
    className: `toc-level-${heading.level}`
  }));
}

/**
 * Estimates reading time based on content length
 * Helper function for blog post metadata
 */
export function estimateReadingTime(content, wordsPerMinute = 200) {
  if (!content) return 0;
  
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return minutes;
}

/**
 * Extracts the first paragraph as an excerpt
 * Falls back to first 150 characters if no paragraph found
 */
export function extractExcerpt(content, maxLength = 150) {
  if (!content) return '';
  
  // Try to find first paragraph (text before first double newline)
  const firstParagraph = content.split(/\n\s*\n/)[0];
  
  if (firstParagraph && firstParagraph.length <= maxLength) {
    return firstParagraph.trim();
  }
  
  // Fallback to truncated content
  const truncated = content.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}