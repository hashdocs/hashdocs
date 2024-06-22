'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export const PathSplit: React.FC = () => {
  const path = usePathname();
  const pathArray = splitPath(path);

  const primaryPageProps = primaryNavigation.find((page) => {
    return page.name.toLowerCase() == pathArray.at(2)?.name.toLowerCase();
  });

  const secondaryPages = pathArray.slice(3);

  return (
    <>
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
    </>
  );
};
