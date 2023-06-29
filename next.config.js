/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "https://dblpeefwccpldqwuzwza.supabase.co"],
    // loader: 'custom',
    // loaderFile: './app/_utils/imageLoader.ts'
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/login',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: 'script-src https://accounts.google.com/gsi/client; frame-src https://accounts.google.com/gsi/; connect-src https://accounts.google.com/gsi/;',
  //         },
  //       ],
  //     },
  //   ]
  // },
  async redirects() {
    return [
      {
        source: "/documents/:slug",
        destination: "/documents/:slug/links", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/settings",
        destination: "/settings/profile", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
