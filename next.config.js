/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'],
      // loader: 'custom',
      // loaderFile: './app/_utils/imageLoader.ts'
    },
    async redirects() {
      return [
        {
          source: '/documents/:slug',
          destination: '/documents/:slug/links', // Matched parameters can be used in the destination
          permanent: true,
        },
        {
          source: '/settings',
          destination: '/settings/profile', // Matched parameters can be used in the destination
          permanent: true,
        },
      ]
    },
  }

module.exports = nextConfig
