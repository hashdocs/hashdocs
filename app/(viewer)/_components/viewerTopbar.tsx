'use client';
import Button from '@/app/_components/button';
import { HashdocsLogo } from '@/app/_components/logo';
import Tooltip from '@/app/_components/tooltip';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MdDownload, MdEmail } from 'react-icons/md';

export default function ViewerTopBar({ document_name, updated_by, is_download_allowed, preview = false, version }: { document_name:string | null, updated_by: string | null, is_download_allowed:boolean, preview?: boolean, version?: number}) {
  const handleDownload = () => {
    const downloadLinkPromise = new Promise<string>(async (resolve, reject) => {
      try {
        if (!is_download_allowed) {
          throw new Error('The author has disabled downloads');
        }

        // const download_link = await getDownloadUrl({ document: props });
        const download_link = null;

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
        {(
          <h1 className="text-shade-gray-500 hidden text-base font-semibold leading-6 tracking-wide lg:flex">
            {`${document_name}${preview ? ' (Preview)' : ''}${version ? ` - Version ${version}` : ''}`}
          </h1>
        )}
        <Tooltip content="Download document">
          <Button size="sm" variant="icon" onClick={handleDownload}>
            <MdDownload className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="Email author">
          <Button size="sm" variant="icon" onClick={() => window.open(`mailto:${updated_by}`)}>
            <MdEmail className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}