'use client';
import Button from '@/app/_components/button';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa6';
import useOrg from '../../_provider/useOrg';
import { primaryNavigation } from '../sidebar/nav.constants';

function splitPath(path: string) {
  const pathArray: { name: string; path: string }[] = [];
  let currentPart = '';

  for (const item of path.split('/').filter(Boolean)) {
    currentPart += '/' + item;

    pathArray.push({ name: item, path: currentPart });
  }

  return pathArray;
}

export default function TopBar() {
  const path = usePathname();
  const { org } = useOrg();

  const pathArray = splitPath(path);

  const primaryPageProps = primaryNavigation.find((page) => {
    return page.path.toLowerCase() === pathArray[0].path.toLowerCase();
  });

  if (!primaryPageProps) return null;

  const secondaryPages = pathArray.slice(1);

  return (
    <div
      className={clsx(
        'flex h-12 w-full flex-shrink-0 flex-row items-center shadow-sm justify-between gap-x-4 border-b border-gray-200 px-4'
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <div className="group flex flex-row items-center gap-x-2 text-xs font-medium lowercase text-gray-500">
          {primaryPageProps && (
            <primaryPageProps.icon
              key={`${primaryPageProps.path}-icon`}
              className={clsx('h-3 w-3')}
              aria-hidden="true"
            />
          )}
          {primaryPageProps && (
            <Link
              href={primaryPageProps.path}
              className="truncaate whitespace-nowrap"
            >
              <div className="font-semibold hover:text-blue-700">
                {primaryPageProps.name}
              </div>
            </Link>
          )}
          {secondaryPages &&
            secondaryPages.map((page) => (
              <Link
                key={`${page.path}`}
                href={page.path}
                className="flex flex-row items-center gap-x-2 max-lg:hidden"
              >
                <div className="">{'>'}</div>
                <div className="max-w-md truncate whitespace-nowrap hover:text-blue-700">
                  {page.name}
                </div>
              </Link>
            ))}
        </div>
      </div>
      <div className="flex items-center gap-1 lg:gap-x-3">
        <Link href={`https://github.com/hashdocs/hashdocs/issues`} target="_blank">
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
