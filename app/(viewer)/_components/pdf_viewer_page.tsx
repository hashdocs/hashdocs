"use client";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdf_viewer"), {
  ssr: false,
});

export default async function PDFViewerPage({
  signedURL,
}: {
  signedURL: string;
}) {
  return <PDFViewer signedURL={signedURL} />;
}
