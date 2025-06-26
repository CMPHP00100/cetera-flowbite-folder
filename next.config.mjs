/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "flowbite.s3.amazonaws.com",
      "pub-36707eda14a84a53a3f02a5252326351.r2.dev",
      "www.promoplace.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-36707eda14a84a53a3f02a5252326351.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.promoplace.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("better-sqlite3");
    }

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    return config;
  },
};

export default nextConfig;
