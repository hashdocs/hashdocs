import { Metadata } from 'next';
import { getLink } from './_actions/link.actions';
import InvalidLink from './_components/invalid_link';
import ViewerAuth from './_components/viewerAuth';
import ViewerTopBar from './_components/viewerTopbar';

export const revalidate = 0;

export async function generateMetadata({
  params: { link_id }, // will be a page or nested layout
}: {
  params: { link_id: string };
}): Promise<Metadata> {
  // fetch data
  const link_props = await getLink({ link_id });

  return {
    title: link_props?.document_name,
    description: 'Securely view this document with Hashdocs',
    openGraph: {
      title: link_props?.document_name ?? 'Hashdocs',
      description: 'Securely view this document with Hashdocs',
      siteName: 'Hashdocs',
      images: [
        {
          url:
            link_props?.thumbnail_image ??
            `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title:
        link_props?.document_name ??
        'Hashdocs - an open source docsend alternative',
      description: 'Securely view this document with Hashdocs',
      siteId: '1467726470533754880',
      creator: '@rbkayz',
      creatorId: '1467726470533754880',
      images: [
        link_props?.thumbnail_image ??
          `${process.env.NEXT_PUBLIC_BASE_URL}/og_base.png`,
      ],
    },
  };
}

export default async function DocumentViewerPage({
  params: { link_id },
}: {
  params: { link_id: string };
}) {
  const link = await getLink({ link_id });

  if (!link) return <InvalidLink />;

  return (
    <main className="flex h-full w-full flex-1 flex-col bg-gray-50">
      <ViewerTopBar link={link} />
      <ViewerAuth link={link} />
    </main>
  );

  // return !signedUrl ? <ViewerAuth /> : <PDFViewerPage signedURL={signedUrl} />;
}
