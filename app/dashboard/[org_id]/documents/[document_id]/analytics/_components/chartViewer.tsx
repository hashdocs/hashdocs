import Loader from '@/app/_components/loader';
import clsx from 'clsx';
import { Document, Thumbnail, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ChartViewer({
  signedUrl,
  page_num,
}: {
  signedUrl: string;
  page_num: number;
}) {
  return (
    <Document
      file={signedUrl}
      loading={<Loader />}
      className="no-print flex w-full flex-1 flex-row justify-center bg-gray-50"
      externalLinkTarget="_blank"
    >
      <Thumbnail
        pageNumber={page_num}
        height={200}
        loading={<Loader />}
        className={clsx(
          'ring-shade-overlay border-shade-line rounded-sm border ring-2 ring-offset-2'
        )}
      />
    </Document>
  );
}
