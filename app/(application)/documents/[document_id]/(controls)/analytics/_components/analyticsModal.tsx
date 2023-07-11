import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, formatTime } from "@/app/_utils/dateFormat";
import Loader from "@/app/_components/navigation/loader";
import dynamic from "next/dynamic";
import { DocumentsContext } from "@/app/(application)/documents/_components/documentsProvider";
import { useParams } from "next/navigation";

interface AnalyticsModalProps {
  viewId: string | null;
  setViewId: (state: string | null) => void;
}

const ChartViewer = dynamic(() => import("./chart_viewer"), {
  ssr: false,
});

const CustomTooltip = ({ active, payload, label, signed_url }: any) => {
  return (
    <div className="rounded-sm bg-white p-2">
      {<ChartViewer signedUrl={signed_url ?? ""} page_num={label as number} />}
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
      fill="#000"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {duration <= 0
        ? "-"
        : duration < 10
        ? duration.toFixed(1)
        : duration.toFixed(0)}
    </text>
  );
};

const AnalyticsModal: React.FC<AnalyticsModalProps> = (
  props: AnalyticsModalProps
) => {
  const { viewId, setViewId } = props;

  const { document_id } = useParams();

  const _documentsContext = useContext(DocumentsContext);

  const { documents } = _documentsContext!;

  const document = documents.find((doc) => doc.document_id === document_id);

  if (!document) {
    return null;
  }

  const { links, versions } = document;

  const link = links?.find(
    (link) => link.link_id && viewId?.includes(link.link_id)
  );

  if (!link) return null;

  const { views } = link;

  const view = views.find((view) => view.view_id === viewId);

  if (!view) return null;

  const { page_count, document_version } = view;

  console.log(view);

  const token =
    versions.find((version) => version.document_version === document_version)
      ?.token ?? "";

  const signed_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document_id}/${document_version}.pdf?token=${token}`;

  if (!page_count) return null;

  const chart_data = Array.from({ length: page_count }, (_, index) => {
    return {
      page_num: index + 1,
      duration:
        (view.view_logs?.find((log) => log.page_num === index + 1)?.duration ??
          0) / 1000,
    };
  });

  /*-------------------------------- RENDER ------------------------------*/

  return (
    <Transition.Root show={viewId ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="z-100 relative"
        onClose={() => setViewId(null)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-shade-overlay bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="z-100 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {!viewId ? (
                <Loader />
              ) : (
                <Dialog.Panel className="relative flex w-full max-w-4xl transform flex-col space-y-6 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-xl transition-all">
                  <div className="flex flex-col justify-between gap-y-4">
                    <Dialog.Title
                      as="h3"
                      className="text-left font-semibold uppercase leading-6"
                    >
                      Analytics
                    </Dialog.Title>
                    <div className="flex flex-row gap-x-2">
                      <div className="flex basis-1/3 flex-col gap-y-3">
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Viewer
                          </div>
                          <div className="basis-2/3 font-semibold">
                            {view.viewer}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Link
                          </div>
                          <div className="basis-2/3 font-semibold">
                            {link.link_name}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Version
                          </div>
                          <div className="basis-2/3 font-semibold">
                            {view.document_version}
                          </div>
                        </div>
                      </div>
                      <div className="flex basis-1/3 flex-col gap-y-3">
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Date
                          </div>
                          <div className="basis-2/3 font-semibold">
                            {formatDate(view.viewed_at, "MMM DD, YYYY HH:MM")}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Location
                          </div>
                          <div className="basis-2/3 font-semibold truncate">
                            {view.geo ?? ""}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="basis-1/3 text-shade-pencil-light">
                            Device
                          </div>
                          <div className="basis-2/3 font-semibold">
                            {(view.ua as any)?.browser?.name ?? ""}
                            {", "}
                            {(view.ua as any)?.os?.name ?? ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex basis-1/3 flex-row items-center justify-between gap-x-3">
                        <div className="flex flex-col items-center">
                          <p className="text-6xl font-semibold text-stratos-default">
                            {formatTime(view.duration)}
                          </p>
                          <p className="text-sm uppercase text-shade-disabled">
                            {"DURATION (MM:SS)"}
                          </p>
                        </div>
                        <div
                          className="relative h-[100px] w-[100px]"
                          style={{ outline: "none" }}
                        >
                          <PieChart
                            width={100}
                            height={100}
                            className="absolute inset-0 focus:outline-none"
                            style={{ outline: "none" }}
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
                              style={{ outline: "none" }}
                              className="focus:outline-none"
                            >
                              {[view.completion, 100 - view.completion].map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    style={{ outline: "none" }}
                                    className="focus:outline-none"
                                    fill={
                                      ["#0010FF", "#FBFBFB"][
                                        index % ["#0010FF", "#FBFBFB"].length
                                      ]
                                    }
                                  />
                                )
                              )}
                            </Pie>
                          </PieChart>
                          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-stratos-default">
                            {`${view.completion}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <span className="bg-white px-2 text-shade-disabled">
                        {"TIME SPENT PER PAGE (SECONDS)"}
                      </span>
                      <div className="ml-4 flex-grow border-t border-shade-line"></div>
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
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AnalyticsModal;
