/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cot/ui"],
  output: "standalone",
  
  experimental: {
    turbo: {},
  },
};

module.exports = nextConfig;
