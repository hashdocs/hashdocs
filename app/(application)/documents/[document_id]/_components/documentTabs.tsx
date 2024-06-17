'use client';
import { DocumentDetailType } from '@/types';
import { documentTabType } from '@/types/documents.types';
import { ChartBarIcon, EyeIcon, LinkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/*=========================================== CONSTANTS ===========================================*/

let documentTabs: documentTabType[] = [
  { name: 'Links', href: 'links', icon: LinkIcon, stats: null },
  { name: 'Views', href: 'views', icon: EyeIcon, stats: null },
  { name: 'Analytics', href: 'analytics', icon: ChartBarIcon, stats: null },
];

/*=========================================== COMPONENT ===========================================*/

export const DocumentTabs: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  documentTabs[0].stats = document.links.length;
  documentTabs[1].stats = document.views.length;

  const pathname = usePathname();
  const activeTab = pathname.split('/').pop();

  return (
    <div className="mb-2">
      {/*Mobile*/}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="border-line focus:border-stratos-default focus:ring-stratos-default block w-full rounded-md"
          defaultValue={
            documentTabs.find((tab) => tab.href === activeTab)?.name
          }
        >
          {documentTabs.map((tab) => (
            <option key={tab.href}>{tab.name}</option>
          ))}
        </select>
      </div>
      {/*Desktop*/}
      <div className="hidden sm:flex border-line border-b">
        <nav className="flex gap-x-8">
          {documentTabs.map((tab) => (
            <Link
              key={tab.href}
              href={`/documents/${document.document_id}/${tab.href}`}
              className={clsx(
                tab.href === activeTab
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-900',
                'group inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium'
              )}
            >
              <tab.icon className={clsx('mr-2 h-5 w-5')} />
              <span className="mr-2">{tab.name}</span>
              {tab.stats ? <span>({tab.stats})</span> : null}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
