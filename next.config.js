/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ["localhost", "https://dblpeefwccpldqwuzwza.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dblpeefwccpldqwuzwza.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      }
    ]
    // loader: 'custom',
    // loaderFile: './app/_utils/imageLoader.ts'
  },
  async redirects() {
    return [
      {
        source: "/documents/:slug",
        destination: "/documents/:slug/links", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/settings",
        destination: "/settings/billing", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/blog',
        destination: `${process.env.BLOG_URL}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${process.env.BLOG_URL}/blog/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
