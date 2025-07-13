// API utility functions with no-cache implementation

export const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const fetchWithNoCache = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      ...noCacheHeaders,
      ...options.headers,
    },
    cache: 'no-store'
  };

  return fetch(url, { ...options, ...defaultOptions });
};
