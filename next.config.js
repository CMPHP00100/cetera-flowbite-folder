/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pub-36707eda14a84a53a3f02a5252326351.r2.dev', 'flowbite.s3.amazonaws.com', 'www.promoplace.com'], // Add your domain here
  },
};

module.exports = nextConfig;