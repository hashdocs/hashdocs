/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/,
        resourceQuery: { not: /url/ },
        use: [{ loader: '@svgr/webpack' }],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  images: {
    // domains: ["localhost", "https://dblpeefwccpldqwuzwza.supabase.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dblpeefwccpldqwuzwza.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    // loader: 'custom',
    // loaderFile: './app/_utils/imageLoader.ts'
  },
  async redirects() {
    return [
      {
        source: '/dashboard/:a/documents/:b',
        destination: '/dashboard/:a/documents/:b/links', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/dashboard/:a/settings',
        destination: '/dashboard/:a/settings/general', // Matched parameters can be used in the destination
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
