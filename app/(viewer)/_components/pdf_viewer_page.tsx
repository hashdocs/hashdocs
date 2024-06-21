"use client";
import { ViewCookieType } from "@/types";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdf_viewer"), {
  ssr: false,
});

export default function PDFViewerPage({
  signedURL,
  viewer
}: {
  signedURL: string;
  viewer?: ViewCookieType;
}) {
  return <PDFViewer signedURL={signedURL} viewer={viewer} />;
}
