/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cot/schema", "@cot/db", "@cot/engine"],
  output: "standalone",
  
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = nextConfig;
