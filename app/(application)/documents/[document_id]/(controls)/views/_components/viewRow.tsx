"use client";
import { formatDate, formatTime } from "@/app/_utils/dateFormat";
import PercentageCircle from "@/app/_components/shared/buttons/percentageCircle";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { classNames } from "@/app/_utils/classNames";
import { useContext, useState } from "react";
import AnalyticsModal from "../../analytics/_components/analyticsModal";
import { DocumentsContext } from "@/app/(application)/documents/_components/documentsProvider";
import { ViewTableType } from "./viewsFilter";

export default function ViewRow(view: ViewTableType, idx: number) {
  const _documents = useContext(DocumentsContext);

  if (!_documents) return null;

  const { setShowViewAnalyticsModal } = _documents;

  return (
    <div
      key={`${view.view_id}`}
      className={classNames(
        "mx-2 grid grid-cols-12 items-center gap-x-2 p-3 ",
        idx > 0 ? "border-t border-shade-line/50" : ""
      )}
    >
      <div className="col-span-3 flex items-center space-x-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-shade-line bg-shade-overlay font-mono font-extrabold uppercase text-shade-disabled">
          {view.viewer.charAt(0)}
        </div>
        <p className={`truncate font-semibold`}>{view.viewer}</p>
      </div>
      <div className="col-span-2 grid truncate">{view.link_name}</div>
      <div className="col-span-2 grid justify-center">
        {view.viewed_at && formatDate(view.viewed_at, "MMM D", true)}
      </div>
      <div className="col-span-2 grid justify-center">
        {formatTime(view.duration)}
      </div>
      <div className="col-span-1 grid justify-center">
        {view.document_version}
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <div className="w-1/3"></div>
        <div className="flex w-1/3 justify-start">
          <PercentageCircle percentage={view.completion} />
        </div>
        <div className="flex w-1/3 justify-end">
          <IconButton
            ButtonId={`${view.view_id}-analytics`}
            ButtonText={""}
            ButtonIcon={ChartBarIcon}
            ButtonSize={4}
            onClick={() => setShowViewAnalyticsModal(view.view_id)}
          />
        </div>
      </div>
    </div>
  );
}
