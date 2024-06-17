'use client';
import Button from '@/app/_components/button';
import { HashdocsLogo } from '@/app/_components/logo';
import Tooltip from '@/app/_components/tooltip';
import { LinkViewType } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MdDownload, MdEmail } from 'react-icons/md';
import { getDownloadUrl } from '../_actions/link.actions';

export default function ViewerTopBar({ link }: { link: LinkViewType }) {
  const handleDownload = () => {
    const downloadLinkPromise = new Promise<string>(async (resolve, reject) => {
      try {
        if (!link.is_download_allowed) {
          throw new Error('The author has disabled downloads');
        }

        const download_link = await getDownloadUrl({ link_id: link.link_id });

        if (!download_link) {
          throw new Error('Failed to generate download link');
        }

        window.open(download_link, '_blank');

        resolve(download_link);
      } catch (error: any) {
        reject(error);
      }
    });

    toast.promise(
      downloadLinkPromise,
      {
        loading: 'Generating download link...',
        success: (url: string) => (
          <p>
            Link generated successfully.{' '}
            <Link
              href={url}
              target="_blank"
              className="text-blue-700 underline"
            >
              Click here
            </Link>{' '}
            to download
          </p>
        ),
        error: (e: any) => e?.message ?? 'Failed to generate download link',
      },
      {
        duration: 6000,
      }
    );
  };

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-gray-200 bg-gray-50 px-4">
      <HashdocsLogo size="sm" full className='!gap-x-0' link />
      <div className="mr-4 flex flex-row items-center justify-center gap-x-4">
        {link && (
          <h1 className="text-shade-gray-500 hidden text-base font-semibold leading-6 tracking-wide lg:flex">
            {link.document_name}
          </h1>
        )}
        <Tooltip content="Download document">
          <Button size="sm" variant="icon" onClick={handleDownload}>
            <MdDownload className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="Email author">
          <Button size="sm" variant="icon" onClick={() => window.open(`mailto:${link.updated_by}`)}>
            <MdEmail className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
