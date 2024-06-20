'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { routes, secondary_navigation } from './settings.constants';

export default function SettingsSidebar() {
  const path = usePathname();

  const defaultNav = Object.values(routes).find((route) =>
    path.includes(route.path)
  );

  const [activeNav, setActiveNav] = useState(defaultNav);

  return (
    <aside className="flex h-full w-56 flex-col justify-between overflow-hidden border-r border-gray-200 px-4">
      <div className="flex flex-col gap-y-2">
        {secondary_navigation.map((nav) => (
          <section key={nav.name} className="grid space-y-2">
            <div className="flex items-center space-x-2 font-medium text-gray-400">
              <nav.icon
                className={'icon h-4 w-4 shrink-0'}
                aria-hidden="true"
              />
              <span>{nav.name}</span>
            </div>
            <ul role="list" className="space-y-1">
              {nav.routes.map((route) => (
                <li key={route.name} className="pl-4">
                  <Link
                    href={route.path}
                    onClick={() => setActiveNav(route)}
                    className={clsx(
                      route.path === activeNav?.path
                        ? 'bg-gray-200/50 text-blue-700'
                        : 'text-gray-600',
                      'group flex items-center gap-x-3 rounded-md px-2 py-1 font-medium hover:bg-gray-200/50'
                    )}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
