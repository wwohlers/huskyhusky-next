/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'huskyhusky-images.s3.us-east-2.amazonaws.com',
        port: '*',
      },
    ],
  },
}

module.exports = nextConfig
