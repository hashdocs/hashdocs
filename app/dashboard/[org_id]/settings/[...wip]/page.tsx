import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/*=========================================== TYPES ===========================================*/

/*=========================================== CONSTANTS ===========================================*/

export default function IntegrationsPage({
  params: { wip },
}: {
  params: {
    wip: string[];
  };
}) {
  const page_name = wip.at(0);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
      <div className="flex items-center justify-center gap-x-2">
        <WrenchScrewdriverIcon className="h-6 w-6 text-gray-500" />
        <h1 className="text-xl capitalize text-gray-500">
          {`${page_name} is coming soon`}
        </h1>
      </div>

      <Link
        href={`https://twitter.com/intent/tweet?text=%40rbkayz`}
        className="text-sm text-gray-500 underline hover:text-blue-700"
      >
        Tweet to us about the feature you want to see next
      </Link>
    </main>
  );
}
