import { Analytics } from '@vercel/analytics/react';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../globals.css';
import HashdocsToast from './_components/toast';
import { inter } from './_utils/font';

export const HASHDOCS_META_TAGS = {
  title: {
    template: '%s | Hashdocs',
    default: 'Hashdocs', // a default is required when creating a template
  },
  description:
    'An open-source dataroom platform with secure document sharing, powerful link controls and realtime tracking. A better alternative to docsend.',
  icon: 'assets/hashdocs_logo_512x512.png',
  og_image: `${
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://' + process.env.VERCEL_BRANCH_URL
  }/assets/og.jpg`,
  theme_color: '#1D4ED8',
};

export const metadata: Metadata = {
  title: HASHDOCS_META_TAGS.title,
  description: `${HASHDOCS_META_TAGS.description}`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ||
      'https://' + process.env.VERCEL_BRANCH_URL ||
      ''
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${HASHDOCS_META_TAGS.title}`,
    description: `${HASHDOCS_META_TAGS.description}`,
    url:
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://' + process.env.VERCEL_BRANCH_URL,
    siteName: HASHDOCS_META_TAGS.title.default,
    images: [
      {
        url: `${HASHDOCS_META_TAGS.og_image}`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${HASHDOCS_META_TAGS.title}`,
    description: `${HASHDOCS_META_TAGS.description}`,
    creator: '@rbkayz',
    images: [`${HASHDOCS_META_TAGS.og_image}`],
  },
};

export const viewport: Viewport = {
  themeColor: `${HASHDOCS_META_TAGS.theme_color}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`flex h-full w-full ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-1 overflow-hidden flex-col items-center text-sm text-gray-900">
        <HashdocsToast />
        {children}
        <Analytics />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QKEK5NGXV4"
          async
        />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-QKEK5NGXV4');
            gtag('config', 'AW-11254957816');`}
        </Script>
      </body>
    </html>
  );
}
