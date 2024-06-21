'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';
import { primaryNavigation } from './nav.constants';

export default function SidebarNav() {
  const path = usePathname();

  const defaultNav =
    primaryNavigation.find((nav) => {
      return path.includes(nav.path);
    }) || primaryNavigation[0];

  const [activeNav, setActiveNav] = useState(defaultNav);

  return (
    <>
      <div className="flex flex-1 flex-col justify-between pb-4 text-sm font-medium text-gray-600">
        <div className="flex flex-col gap-y-2">
          {primaryNavigation.map((nav, index) => (
            <Fragment key={nav.path}>
              <Link
                key={nav.path}
                href={nav.path}
                onClick={() => setActiveNav(nav)}
                className={clsx(
                  nav.path === activeNav.path
                    ? 'bg-gray-200/50 font-semibold text-blue-700'
                    : '',
                  'group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-200/50'
                )}
              >
                <div className="flex items-center gap-x-4 whitespace-nowrap">
                  {/* <Tooltip
                    content={
                      <div className="flex max-w-xs flex-col items-start gap-y-1 text-start">
                        <span className="text-xs13 font-semibold">
                          {nav.name}
                        </span>
                        <span className="whitespace-normal text-xs11 leading-3">
                          {nav.description}
                        </span>
                      </div>
                    }
                    placement="right"
                  > */}
                  <nav.icon
                    className={'h-6 w-6 shrink-0 scale-90'}
                    aria-hidden="true"
                  />
                  {nav.name}
                  {/* </Tooltip> */}
                </div>
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
