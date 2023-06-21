"use client";
import Loader from "@/app/_components/navigation/loader";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default async function ViewTestPage({
  params: { link_id },
}: {
  params: { link_id: string };
}) {
  return <PDFViewer />;
}
