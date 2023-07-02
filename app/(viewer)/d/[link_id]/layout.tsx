import ViewerTopBar from "@/app/(viewer)/d/[link_id]/_components/viewerTopbar";
import { getLinkProps } from "../../_components/functions";
import { Metadata } from "next";
import ViewerProvider from "./_components/viewerProvider";

export const metadata: Metadata = {
  title: "Secure Viewer",
  description:
    "An open-source docsend alternative with powerful link controls and realtime tracking",
  icons: {
    icon: "/hashdocs_gradient_square.png",
  },
  themeColor: "#0010FF",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? ""),
  openGraph: {
    title: "Hashdocs",
    description:
      "An open-source docsend alternative with powerful link controls and realtime tracking",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Hashdocs",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashdocs - an open source docsend alternative",
    description:
      "Hashdocs is a powerful document sharing platform with advanced link controls and realtime tracking",
    siteId: "1467726470533754880",
    creator: "@rbkayz",
    creatorId: "1467726470533754880",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`],
  },
};

export default async function ViewerLayout({
  children,
  params: { link_id },
}: {
  children: React.ReactNode;
  params: { link_id: string };
}) {
  const link_props = await getLinkProps(link_id);

  return (
    <ViewerProvider>
      <main className="flex h-screen w-full flex-1 flex-col">
        <div className="sticky top-0 z-10 w-full">
          <ViewerTopBar linkProps={link_props} />
        </div>
        <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
          {children}
        </div>
      </main>
    </ViewerProvider>
  );
}
