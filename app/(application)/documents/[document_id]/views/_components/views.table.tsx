'use client';
import PercentageCircle from '@/app/_components/shared/buttons/percentageCircle';
import Table from '@/app/_components/table';
import { CopyLinkToClipboard } from '@/app/_utils/common';
import { formatTime, relativeDate } from '@/app/_utils/dateFormat';
import { DocumentDetailType, ViewType, enum_colors } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { ViewAnalyticsChartButton } from './analytics.modal';
import SearchInput from './views.search';

export const ViewsTable: React.FC<{
  views: ViewType[];
  document: DocumentDetailType;
  show_search?: boolean;
}> = ({ views, document, show_search = false }) => {
  const searchQueryParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string | null>(
    searchQueryParams.get('id') || null
  );

  const viewsMemo = useMemo(
    () =>
      views.filter((view) =>
        view.link_id
          .concat(view.link_name || '', view.viewer)
          .toLowerCase()
          .includes(searchQuery?.toLowerCase() || '')
      ),
    [views, searchQuery]
  );

  return (
    <div className="flex flex-col gap-y-2">
      {show_search && (
        <SearchInput
          query={searchQuery}
          setQuery={setSearchQuery}
          wrapperClassName="w-64"
          reset={(e) => setSearchQuery(null)}
        />
      )}
      <Table
        indexId="view_id"
        data={viewsMemo}
        enableRowSelection={false}
        enablePagination={false}
        disabled={false}
      >
        <Table.Header className="group/header !border-none !bg-gray-50/90 text-sm font-medium text-gray-400 !shadow-none">
          <Table.Cell className="w-96">Email</Table.Cell>
          <Table.Cell className="w-48">Link</Table.Cell>
          <Table.Cell className="w-48 text-center">Date</Table.Cell>
          <Table.Cell className="w-48 text-center">Duration (min)</Table.Cell>
          <Table.Cell className="w-48 text-center">Version</Table.Cell>
          <Table.Cell className="w-48 text-center">Completion %</Table.Cell>
        </Table.Header>
        {viewsMemo.map((view) => (
          <Table.Row
            id={view.view_id!}
            key={view.view_id!}
            className="h-12 border-none align-middle"
          >
            <Table.Cell className="">
              <div className="flex items-center gap-x-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full font-mono font-extrabold uppercase text-white"
                  style={{
                    backgroundColor:
                      enum_colors[
                        Math.floor(Math.random() * enum_colors.length)
                      ],
                  }}
                >
                  {view.viewer?.charAt(0)}
                </div>
                <p className={`truncate font-semibold`}>{view.viewer}</p>
              </div>
            </Table.Cell>
            <Table.Cell className="truncate">
              <div
                className="group flex items-center gap-x-1 hover:cursor-pointer"
                onClick={() =>
                  CopyLinkToClipboard(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/d/${view.link_id}`,
                    false
                  )
                }
              >
                {view.link_name}
                <MdCopyAll className="opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Table.Cell>
            <Table.Cell className="text-center">
              {relativeDate(view.viewed_at)}
            </Table.Cell>
            <Table.Cell className="text-center">
              {formatTime(view.duration)}
            </Table.Cell>
            <Table.Cell className="text-center">
              {view.document_version}
            </Table.Cell>
            <Table.Cell className="">
              <div className="flex items-center justify-between text-center">
                <div className="w-1/3"></div>
                <div className="flex w-1/3 justify-start">
                  <PercentageCircle percentage={view.completion} />
                </div>
                <div className="flex w-1/3 justify-end">
                  <ViewAnalyticsChartButton
                    document={document}
                    view_id={view.view_id}
                    key={view.view_id}
                  />
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};
