import toast, { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import Script from "next/script";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: {
    template: '%s | Hashdocs',
    default: 'Hashdocs', // a default is required when creating a template
  },
  description: "An open-source docsend alternative with powerful link controls and realtime tracking",
  icons: {
    icon: '/hashdocs_gradient_square.png'
  },
  themeColor: "#0010FF",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? ""),
  openGraph: {
    title: 'Hashdocs',
    description: 'An open-source docsend alternative with powerful link controls and realtime tracking',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Hashdocs',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashdocs - an open source docsend alternative',
    description: 'Hashdocs is a powerful document sharing platform with advanced link controls and realtime tracking',
    siteId: '1467726470533754880',
    creator: '@rbkayz',
    creatorId: '1467726470533754880',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full bg-shade-overlay">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex min-h-full min-w-full items-center justify-center text-sm text-shade-pencil-black">
        <Toaster
          toastOptions={{
            style: {
              background: "#FFFFFF",
              fontWeight: "bolder",
              fontSize: "12px",
              borderRadius: "8px",
              width: "fit-content",
              maxWidth: "50%",
            },
          }}
        />
        {children}
        <Analytics />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
