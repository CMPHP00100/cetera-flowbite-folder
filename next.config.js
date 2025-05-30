/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*images: {
    domains: ['pub-36707eda14a84a53a3f02a5252326351.r2.dev', 'flowbite.s3.amazonaws.com', 'www.promoplace.com'], // Add your domain here
  },*/
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
};

module.exports = nextConfig;
