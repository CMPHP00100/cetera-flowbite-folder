/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.promoplace.com",
        port: "", // Optional, if you're using a non-default port
        pathname: "/**", // Optional, specify path pattern if needed
      },
    ],
  },
};

export default nextConfig;
