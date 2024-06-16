'use client';
import { HashdocsLogo } from '@/app/_components/logo';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import SidebarNav from './sidebarNav';
import { SidebarTopButton } from './sidebarTopButton';

export default function MainSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={clsx(
        'z-50 hidden flex-shrink-0  flex-col justify-between gap-y-2 !overflow-x-hidden border-r border-gray-200 px-2 transition-all ease-in-out scrollbar-none lg:flex shadow-sm',
        isOpen ? 'w-52' : 'w-14'
      )}
      // onMouseEnter={() => setIsOpen(true)}
      // onMouseLeave={() => setIsOpen(false)}
    >
      <Link href={`/`} className="flex items-center ml-0.5 my-1 gap-x-2.5 text-gray-gradient">
        <HashdocsLogo size="md" className="shrink-0" />
        <p className="text-2xl font-black tracking-wide mt-2 ">Hashdocs</p>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarNav />
      </div>
      <SidebarTopButton />
    </aside>
  );
}
