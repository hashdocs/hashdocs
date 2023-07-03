import ViewerTopBar from "@/app/(viewer)/d/[link_id]/_components/viewerTopbar";
import { getLinkProps } from "../../_components/functions";
import ViewerProvider from "./_components/viewerProvider";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata({
  params: { link_id }, // will be a page or nested layout
}: {
  params: { link_id: string };
}): Promise<Metadata> {
  // fetch data
  const link_props = await getLinkProps(link_id);

  return {
    title: link_props?.document_name,
    description: "Securely view this document with Hashdocs",
    openGraph: {
      title: link_props?.document_name ?? "Hashdocs",
      description: "Securely view this document with Hashdocs",
      siteName: "Hashdocs",
      images: [
        {
          url:
            link_props?.image ??
            `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        link_props?.document_name ??
        "Hashdocs - an open source docsend alternative",
      description: "Securely view this document with Hashdocs",
      siteId: "1467726470533754880",
      creator: "@rbkayz",
      creatorId: "1467726470533754880",
      images: [
        link_props?.image ?? `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
      ],
    },
  };
}

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
