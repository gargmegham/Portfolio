/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["aceternity.com", "images.unsplash.com"],
  },
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.glsl/,
      loader: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
