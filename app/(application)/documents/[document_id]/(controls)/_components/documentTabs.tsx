"use client";
import { ChartBarIcon, EyeIcon, LinkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { classNames } from "@/app/_utils/classNames";
import { DocumentType, documentTabType } from "@/types/documents.types";

/*=========================================== CONSTANTS ===========================================*/

let documentTabs: documentTabType[] = [
  { name: "Links", href: "links", icon: LinkIcon, stats: null },
  { name: "Views", href: "views", icon: EyeIcon, stats: null },
  { name: "Analytics", href: "analytics", icon: ChartBarIcon, stats: null },
];

/*=========================================== COMPONENT ===========================================*/

export default function DocumentTabs(document: DocumentType) {
  const total_links_count = document.links.length ?? 0;
  let total_views_count = 0;

  document.links.forEach((link) => {
    total_views_count += link.views.length ?? 0;
  });

  documentTabs[0].stats = total_links_count;
  documentTabs[1].stats = total_views_count;

  const activeTab = useSelectedLayoutSegment();

  return (
    <div className="mb-2">
      {/*Mobile*/}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="border-line block w-full rounded-md focus:border-stratos-default focus:ring-stratos-default"
          defaultValue={
            documentTabs.find((tab) => tab.href === activeTab)?.name
          }
        >
          {documentTabs.map((tab) => (
            <option key={tab.href}>{tab.name}</option>
          ))}
        </select>
      </div>
      {/*Desktop*/}
      <div className="hidden sm:block">
        <div className="border-line border-b">
          <nav className="flex space-x-8">
            {documentTabs.map((tab) => (
              <Link
                key={tab.href}
                href={`/documents/${document.document_id}/${tab.href}`}
                className={classNames(
                  tab.href === activeTab
                    ? "border-stratos-default text-stratos-default"
                    : "border-transparent text-shade-pencil-light hover:border-shade-line hover:text-shade-pencil-dark",
                  "group inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium"
                )}
              >
                <tab.icon className={classNames("mr-2 h-5 w-5")} />
                <span className="mr-2">{tab.name}</span>
                {tab.stats ? <span>({tab.stats})</span> : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
