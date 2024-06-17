'use client';
import PercentageCircle from '@/app/_components/shared/buttons/percentageCircle';
import Table from '@/app/_components/table';
import { formatDate, formatTime } from '@/app/_utils/dateFormat';
import { DocumentDetailType, enum_colors } from '@/types';

export const ViewsTable: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  return (
    <Table
      indexId="view_id"
      className="bg-gray-50"
      wrapperClassName='!bg-gray-50'
      data={document.views}
      enableRowSelection={false}
      enablePagination={false}
      disabled={false}
    >
      <Table.Header className="group/header text-sm font-medium text-gray-600 !border-none !bg-gray-50">
        <Table.Cell className="w-96">Email</Table.Cell>
        <Table.Cell className="w-48">Link</Table.Cell>
        <Table.Cell className="w-48 text-center">Date</Table.Cell>
        <Table.Cell className="w-48 text-center">Duration (min)</Table.Cell>
        <Table.Cell className="w-48 text-center">Version</Table.Cell>
        <Table.Cell className="w-48 text-center">Completion %</Table.Cell>
      </Table.Header>
      {document.views.map((view) => (
        <Table.Row
          id={view.view_id!}
          key={view.view_id!}
          className="h-12 align-middle"
        >
          <Table.Cell className="">
            <div className="flex items-center gap-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 font-mono font-extrabold uppercase text-white" style={{
                backgroundColor: enum_colors[Math.floor(Math.random() * enum_colors.length)]
              }}>
                {view.viewer?.charAt(0)}
              </div>
              <p className={`truncate font-semibold`}>{view.viewer}</p>
            </div>
          </Table.Cell>
          <Table.Cell className="truncate">{view.link_id}</Table.Cell>
          <Table.Cell className="text-center">
            {formatDate(view.viewed_at!, 'MMM D', true)}
          </Table.Cell>
          <Table.Cell className="text-center">
            {formatTime(view.duration!)}
          </Table.Cell>
          <Table.Cell className="text-center">
            {view.document_version}
          </Table.Cell>
          <Table.Cell className="justify-betweentext-center flex items-center">
            <div className="w-1/3"></div>
            <div className="flex w-1/3 justify-start">
              <PercentageCircle percentage={view.completion!} />
            </div>
            <div className="flex w-1/3 justify-end">
              {/* <IconButton
                ButtonId={`${view.view_id}-analytics`}
                ButtonText={""}
                ButtonIcon={ChartBarIcon}
                ButtonSize={4}
                onClick={() => {
                  setShowViewAnalyticsModal(view.view_id);
                }}
              /> */}
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
};
