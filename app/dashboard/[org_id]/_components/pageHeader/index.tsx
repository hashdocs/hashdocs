'use client';
import { usePathname } from 'next/navigation';
import { primaryNavigation } from '../sidebar/nav.constants';

export const PageHeader = () => {
  const path = usePathname();

  const pageProps = primaryNavigation.find((page) => path.includes(page.path));

  if (!pageProps) {
    throw new Error('Could not load page properties');
  }

  return (
    <div className="flex flex-col items-start gap-y-1">
      <h3 className="text-base md:text-lg font-semibold">{pageProps.name}</h3>
      <p className="text-xs md:text-sm text-gray-400 truncate">{pageProps.description}</p>
    </div>
  );
};
