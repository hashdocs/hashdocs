import Button from '@/app/_components/button';
import clsx from 'clsx';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { IoHelpCircle } from 'react-icons/io5';
import { PathSplit } from './pathSplit';

export default function TopBar() {
  return (
    <div
      className={clsx(
        'hidden h-12 w-full flex-shrink-0 flex-row items-center justify-between gap-x-4 border-b border-gray-200 px-4 shadow-sm lg:flex'
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <div className="group flex flex-row items-center gap-x-2 text-xs font-medium lowercase text-gray-500">
          <PathSplit />
        </div>
      </div>
      <div className="flex items-center gap-x-3">
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
        <Link href={`mailto:bharat@hashdocs.org`} target="_blank">
          <Button size="sm" variant="outline">
            <IoHelpCircle className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
