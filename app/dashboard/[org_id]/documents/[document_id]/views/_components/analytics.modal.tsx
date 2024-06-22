import Button from '@/app/_components/button';
import Modal, { ModalRef } from '@/app/_components/modal';
import { formatDate, formatTime } from '@/app/_utils/dateFormat';
import { DocumentDetailType } from '@/types';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { MdBarChart } from 'react-icons/md';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ViewAnalyticsModalProps = {
  modalRef: React.RefObject<ModalRef>;
  view_id: string;
  document: DocumentDetailType;
};

const ChartViewer = dynamic(() => import('./chart_viewer'), {
  ssr: false,
});

const CustomTooltip = ({ active, payload, label, signed_url }: any) => {
  return (
    <div className="rounded-sm bg-white p-2">
      {<ChartViewer signedUrl={signed_url ?? ''} page_num={label as number} />}
    </div>
  );
};

const CustomLabel = ({ x, y, width, height, value }: any) => {
  const radius = 10;

  const duration = parseFloat(value);

  return (
    <text
      x={x + width / 2}
      y={y - radius}
      color='#111'
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {duration <= 0
        ? '-'
        : duration < 10
        ? duration.toFixed(1)
        : duration.toFixed(0)}
    </text>
  );
};

export const ViewAnalyticsModal: React.FC<ViewAnalyticsModalProps> = ({
  modalRef,
  view_id,
  document,
}) => {
  if (!document) return null;

  const view = document.views.find((v) => v.view_id === view_id);

  if (!view) return null;

  const link = document.links.find((l) => l.link_id === view.link_id);

  if (!link) return null;

  const signed_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document.org_id}/${document.document_id}/${document.document_version}.pdf?token=${document.token}`;

  const chart_data = Array.from({ length: document.page_count }, (_, index) => {
    return {
      page_num: index + 1,
      duration: (view.view_logs?.[index + 1] ?? 0) / 1000,
    };
  });

  return (
    <Modal ref={modalRef} className="w-full max-w-5xl">
      <div className="flex flex-col justify-between gap-y-4">
        <div className="flex flex-row gap-x-2">
          <div className="flex basis-1/3 flex-col gap-y-3">
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Viewer</div>
              <div className="basis-2/3 font-semibold">{view.viewer}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Link</div>
              <div className="basis-2/3 font-semibold">{link.link_name}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Version</div>
              <div className="basis-2/3 font-semibold">
                {view.document_version}
              </div>
            </div>
          </div>
          <div className="flex basis-1/3 flex-col gap-y-3">
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Date</div>
              <div className="basis-2/3 font-semibold">
                {formatDate(view.viewed_at, 'MMM DD, YYYY HH:mm')}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Location</div>
              <div className="basis-2/3 truncate font-semibold">
                {!view.geo
                  ? 'Unknown'
                  : `${view.geo?.city ?? ''},${
                      view.geo?.country ?? ''
                    }`}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-500 basis-1/3">Device</div>
              <div className="basis-2/3 font-semibold">
                {(view.ua as any)?.browser?.name ?? ''}
                {', '}
                {(view.ua as any)?.os?.name ?? ''}
              </div>
            </div>
          </div>
          <div className="flex basis-1/3 flex-row items-center justify-between gap-x-3">
            <div className="flex flex-col items-center">
              <p className="text-blue-700 text-6xl font-semibold">
                {formatTime(view.duration)}
              </p>
              <p className="text-gray-400 text-sm uppercase">
                {'DURATION (MM:SS)'}
              </p>
            </div>
            <div
              className="relative h-[100px] w-[100px]"
              style={{ outline: 'none' }}
            >
              <PieChart
                width={100}
                height={100}
                className="absolute inset-0 focus:outline-none"
                style={{ outline: 'none' }}
              >
                <Pie
                  data={[
                    { value: view.completion },
                    { value: 100 - view.completion },
                  ]}
                  innerRadius={30}
                  outerRadius={40}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  style={{ outline: 'none' }}
                  className="focus:outline-none"
                >
                  {[view.completion, 100 - view.completion].map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        style={{ outline: 'none' }}
                        className="focus:outline-none"
                        fill={
                          ['#0010FF', '#FBFBFB'][
                            index % ['#0010FF', '#FBFBFB'].length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>
              </PieChart>
              <p className="text-blue-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
                {`${view.completion}%`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-1">
          <span className="text-gray-400 bg-white px-2">
            {'TIME SPENT PER PAGE (SECONDS)'}
          </span>
          <div className="border-gray-200 ml-4 flex-grow border-t"></div>
        </div>
        <BarChart
          width={800}
          height={300}
          data={chart_data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis dataKey="page_num" />
          <YAxis name="Duration" allowDecimals={false} />
          <Tooltip
            offset={20}
            content={<CustomTooltip signed_url={signed_url} />}
          />
          <Bar
            dataKey="duration"
            fill="#0010FF"
            minPointSize={1}
            label={CustomLabel}
          ></Bar>
        </BarChart>
      </div>
    </Modal>
  );
};

export const ViewAnalyticsChartButton: React.FC<{
  view_id: string;
  document: DocumentDetailType;
}> = ({ view_id, document }) => {
  const modalRef = useRef<ModalRef>(null);

  const view = document.views.find((v) => v.view_id === view_id);

  return (
    <>
      <Button
        size="sm"
        variant="icon"
        onClick={() => {
          modalRef.current?.openModal();
        }}
        className='shrink-0'
        disabled={!view}
      >
        <MdBarChart />
      </Button>
      <ViewAnalyticsModal
        document={document}
        view_id={view_id}
        modalRef={modalRef}
      />
    </>
  );
};
