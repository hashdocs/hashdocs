'use client';
import Button from '@/app/_components/button';
import { HashdocsLogo } from '@/app/_components/logo';
import clsx from 'clsx';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';

export default function MobileTopBar() {
  return (
    <div
      className={clsx(
        'flex lg:hidden h-12 w-full flex-shrink-0 flex-row items-center justify-between gap-x-4 border-b border-gray-200 px-2 shadow-sm'
      )}
    >
      <HashdocsLogo full size="sm" className='!gap-x-0.5' />
      <div className="flex items-center gap-1 lg:gap-x-3">
        <Link
          href={`https://github.com/hashdocs/hashdocs/issues`}
          target="_blank"
        >
          <Button
            variant="outline"
            size="sm"
            className="group flex items-center gap-x-1"
          >
            <FaGithub className="h-4 w-4 group-hover:animate-pulse" />
            <span>Submit an issue</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
