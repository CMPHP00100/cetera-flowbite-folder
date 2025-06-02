
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-36707eda14a84a53a3f02a5252326351.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.promoplace.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: process.env.AMPLIFY ? "standalone" : undefined,
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;