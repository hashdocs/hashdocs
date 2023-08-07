const { withSentryConfig } = require("@sentry/nextjs");

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
  sentry: {
    hideSourceMaps:true
  }
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  org: "hashlabs-io",
  project: "console",

  // An auth token is required for uploading source maps.
  // You can get an auth token from https://sentry.io/settings/account/api/auth-tokens/
  // The token must have `project:releases` and `org:read` scopes for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
