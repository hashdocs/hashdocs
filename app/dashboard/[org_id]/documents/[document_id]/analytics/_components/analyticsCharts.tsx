'use client';
import Dropdown from '@/app/_components/dropdown';
import { formatTime } from '@/app/_utils/dateFormat';
import { DocumentDetailType } from '@/types';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const AverageViewCompletion: React.FC<{
  document: DocumentDetailType;
}> = ({ document }) => {
  const valid_views = document.views.filter(
    (v) => !!v.is_authorized && !!v.completion
  );

  const average_view_completion =
    valid_views.reduce((acc, view) => acc + view.completion, 0) /
    valid_views.length;

  const average_view_duration =
    valid_views.reduce((acc, view) => acc + view.duration, 0) /
    valid_views.length;

  return (
    <div className="flex flex-col items-start gap-y-4">
      <div className="flex h-28 flex-col items-start gap-y-2">
        <p className="text-sm uppercase text-gray-400">
          {'AVG DURATION (MM:SS)'}
        </p>
        <p className="flex flex-1 items-start text-6xl font-semibold text-blue-700">
          {formatTime(average_view_duration)}
        </p>
      </div>
      <div className="flex h-28 flex-col items-start gap-y-2">
        <p className="text-sm uppercase text-gray-400">{'COMPLETION'}</p>
        <div className="relative h-20 w-20">
          <PieChart
            width={80}
            height={80}
            className="absolute inset-0 focus:outline-none"
            style={{ outline: 'none' }}
          >
            <Pie
              data={[
                { value: average_view_completion },
                { value: 100 - average_view_completion },
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
              {[average_view_completion, 100 - average_view_completion].map(
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
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-blue-700">
            {`${Math.round(average_view_completion)}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ViewsLineChart: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  const views_by_date = document.views.reduce((acc, view) => {
    const date = dayjs(view.viewed_at).format('DD-MMM-YY');
    if (!acc[date]) acc[date] = 0;
    acc[date]++;
    return acc;
  }, {} as { [date: string]: number });

  const data = Object.entries(views_by_date)
    .map(([date, views]) => ({
      date,
      views,
    }))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  return (
    <div className="flex flex-col items-center gap-y-2">
      <p className="text-sm uppercase text-gray-400">{'VIEW HISTORY'}</p>
      <LineChart width={640} height={320} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip wrapperClassName="rounded-md" />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#0010FF"
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </div>
  );
};

export const ViewsbyLinkChart: React.FC<{ document: DocumentDetailType }> = ({
  document,
}) => {
  const router = useRouter();

  const views_by_link = document.views.reduce((acc, view) => {
    const link = view.link_id;
    if (!acc[link]) acc[link] = 0;
    acc[link]++;
    return acc;
  }, {} as { [link: string]: number });

  const data = Object.entries(views_by_link)
    .map(([link, views]) => ({
      link,
      views,
    }))
    .sort((a, b) => {
      return b.views - a.views;
    });

  // if length of data is less than 8, then fill the rest with empty data
  if (data.length < 8) {
    for (let i = data.length; i < 8; i++) {
      data.push({ link: '', views: 0 });
    }
  }

  return (
    <div className="flex flex-col items-center gap-y-2">
      <p className="text-sm uppercase text-gray-400">{'Top links'}</p>
      <BarChart
        width={320}
        height={320}
        data={data.length >= 8 ? data.slice(0, 8) : data}
        layout="vertical"
        barSize={20}
        barGap={20}
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="link" />
        <Bar
          dataKey="views"
          cursor={'pointer'}
          fill="#0010FF"
          onClick={(data, index) =>
            router.push(
              `/dashboard/${document.org_id}/documents/${document.document_id}/views?id=${data.link}`
            )
          }
        >
          <LabelList dataKey="views" position="right" />
        </Bar>
      </BarChart>
    </div>
  );
};

const ChartViewer = dynamic(() => import('./chartViewer'), {
  ssr: false,
});

export const TimeSpentByPageChart: React.FC<{
  chart_data: { page_num: number; duration: number }[];
  signed_url: string;
  width?: number;
  height?: number;
}> = ({ chart_data, signed_url, width = 720, height = 300 }) => {
  const CustomTooltip = ({ active, payload, label, signed_url }: any) => {
    return (
      <div className="rounded-sm bg-white p-2">
        {
          <ChartViewer
            signedUrl={signed_url ?? ''}
            page_num={label as number}
          />
        }
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
        color="#111"
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

  return (
    <BarChart
      width={width}
      height={height}
      data={chart_data}
      margin={{
        top: 10,
        bottom: 10,
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
  );
};

export const AverageTimeSpentByPageChart: React.FC<{
  document: DocumentDetailType;
}> = ({ document }) => {
  const [selectedVersion, setSelectedVersion] = React.useState<number>(
    document.document_version
  );

  const version = useMemo(
    () => document.versions.find((v) => v.document_version === selectedVersion),
    [selectedVersion, document.versions]
  );

  const signed_url = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document.org_id}/${document.document_id}/${version?.document_version}.pdf?token=${version?.token}`,
    [version, document]
  );

  const views = useMemo(
    () => document.views.filter((v) => v.document_version === selectedVersion),
    [selectedVersion, document.views]
  );

  const chart_data = useMemo(
    () =>
      Array.from({ length: version?.page_count || 0 }, (_, index) => {
        let totalDuration = 0;
        let count = 0;

        views.forEach((view) => {
          const duration = view.view_logs?.[index + 1];
          if (duration != null) {
            totalDuration += duration / 1000;
            count++;
          }
        });

        const averageDuration = count > 0 ? totalDuration / count : 0;

        return {
          page_num: index + 1,
          duration: averageDuration,
        };
      }),
    [version, views]
  );

  if (!version) return null;

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex items-center justify-center py-1">
        <span className="px-2 text-gray-400">
          {'TIME SPENT PER PAGE (SECONDS)'}
        </span>
        <div className="ml-4 flex-grow border-t border-gray-200"></div>
        <Dropdown
          items={document.versions.map((v) => ({
            element: (
              <div
                className="flex cursor-pointer items-center gap-x-2 px-2 py-1 hover:bg-gray-50"
                onClick={() => {
                  setSelectedVersion(v.document_version);
                }}
              >{`Version ${v.document_version}`}</div>
            ),
          }))}
        >
          <div className="flex items-center gap-x-2 rounded bg-white px-2 py-1 shadow">
            <p className="font-semibold">{`Version ${selectedVersion}`}</p>
            <BiChevronDown />
          </div>
        </Dropdown>
      </div>
      <TimeSpentByPageChart
        chart_data={chart_data}
        signed_url={signed_url}
        width={1120}
      />
    </div>
  );
};
