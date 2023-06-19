/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/documents/:slug',
          destination: '/documents/:slug/links', // Matched parameters can be used in the destination
          permanent: true,
        },
      ]
    },
  }

module.exports = nextConfig
