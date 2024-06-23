import { redirect } from 'next/navigation';
import { getDocument } from '../../_actions/documents.actions';
import {
    AverageTimeSpentByPageChart,
    AverageViewCompletion,
    ViewsLineChart,
    ViewsbyLinkChart,
} from './_components/analyticsCharts';

export default async function Page({
  params: { document_id, org_id }, // will be a page or nested layout
}: {
  params: { document_id: string; org_id: string };
}) {
  const document = await getDocument({ document_id, org_id });

  if (!document) {
    redirect(`/dashboard/${org_id}/documents`);
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 py-4 overflow-x-auto overflow-y-hidden">
      <div className="flex justify-between gap-x-4">
        <AverageViewCompletion document={document} />
        <ViewsLineChart document={document} />
        <ViewsbyLinkChart document={document} />
      </div>
      <AverageTimeSpentByPageChart document={document} />
    </div>
  );
}
