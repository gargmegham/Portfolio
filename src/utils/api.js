export const fetchWithNoCache = async (url, options = {}) => {
  return fetch(url, options);
};
