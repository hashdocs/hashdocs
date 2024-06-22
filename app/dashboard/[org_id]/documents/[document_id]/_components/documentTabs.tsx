'use client';
import { DocumentDetailType } from '@/types';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { IoAnalytics, IoEye, IoLink } from 'react-icons/io5';

/*=========================================== COMPONENT ===========================================*/

export const DocumentTabs: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  const documentTabs: {
    [key: string]: {
      name: string;
      href: string;
      icon: IconType;
      stats: number | null;
    };
  } = {
    links: {
      name: 'Links',
      href: 'links',
      icon: IoLink,
      stats: document.total_links_count,
    },
    views: {
      name: 'Views',
      href: 'views',
      icon: IoEye,
      stats: document.total_views_count,
    },
    analytics: {
      name: 'Analytics',
      href: 'analytics',
      icon: IoAnalytics,
      stats: null,
    },
  };

  const pathname = usePathname();
  const activeTab = pathname.split('/').pop();
  const basepath = pathname.replace(activeTab ?? '', '');

  if (!activeTab) return null;

  return (
    <div className="border-line border-b flex">
      <nav className="flex flex-1 justify-start w-full gap-x-4 lg:gap-x-8">
        {Object.entries(documentTabs).map(([name, tab]) => (
          <Link
            key={tab.href}
            href={`${basepath}/${tab.href}`}
            className={clsx(
              tab.href === activeTab
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-900',
              'group inline-flex items-center border-b-2 px-1 py-3 gap-x-2 text-sm font-medium'
            )}
          >
            <tab.icon className={clsx('h-5 w-5')} />
            <span className="">{tab.name}</span>
            {tab.stats ? <span>({tab.stats})</span> : null}
          </Link>
        ))}
      </nav>
    </div>
  );
};
