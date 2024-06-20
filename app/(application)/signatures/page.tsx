import Placeholder from '@/app/_components/placeholder';
import { PageHeader } from '../_components/pageHeader';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col py-2">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader />
      </div>
      <Placeholder />
    </div>
  );
}
