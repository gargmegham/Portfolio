/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["aceternity.com", "images.unsplash.com", "wuyhmswgjuptbzrbvoyl.supabase.co"],
  },
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|woff2|glb)/,
      loader: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
