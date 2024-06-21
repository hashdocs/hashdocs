'use client';
import Loader from '@/app/_components/loader';
import { ViewCookieType } from '@/types';
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { RefObject, createRef, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';
import {
  DocumentCallback,
  OnItemClickArgs,
  PageCallback,
} from 'react-pdf/dist/cjs/shared/types';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { updatePageTimes } from '../d/[link_id]/_actions/link.actions';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({
  signedURL,
  viewer,
}: {
  signedURL: string;
  viewer?: ViewCookieType;
}) {
  const numPagesRef = useRef<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const pageHeight = window.innerHeight * 0.8;
  const pageWidth = window.innerWidth * 0.65;
  const thumbnailWidth = window.innerWidth * 0.12;
  const thumbnailHeight = window.innerHeight * 0.2;
  const [zoom, setZoom] = useState(1);
  const [pageRefs, setPageRefs] = useState<
    (RefObject<HTMLDivElement> | null)[]
  >([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const scrollableElementRef = useRef<HTMLDivElement>(null);
  const pageTimesRef = useRef<
    { pageNumber: number; entryTime: number; exitTime?: number }[]
  >([]);
  const [pageCanvasRefs, setPageCanvasRefs] = useState<
    (RefObject<HTMLCanvasElement> | null)[]
  >([]);

  const { link_id } = useParams();

  /* -------------------------------- FUNCTIONS ------------------------------- */

  // Handle thumbnail click
  function handleThumbnailClick(args: OnItemClickArgs) {
    // setActivePage(args.pageNumber);
    scrollableElementRef.current?.scrollTo({
      top: pageRefs[args.pageIndex]?.current?.offsetTop! - 136,
      behavior: 'instant',
    });
  }

  // First call when the document loads to set the page count
  function onDocumentLoadSuccess(document: DocumentCallback) {
    numPagesRef.current = document.numPages;

    pageTimesRef.current = [{ pageNumber: activePage, entryTime: Date.now() }];

    // Initialize an array of refs
    setPageRefs((oldRefs) =>
      Array(document.numPages)
        .fill(null)
        .map((_, i) => oldRefs[i] || createRef())
    );

    setPageCanvasRefs((oldRefs) =>
      Array(document.numPages)
        .fill(null)
        .map((_, i) => oldRefs[i] || createRef())
    );
  }

  // Handle page render success
  function onRenderSuccess(page: PageCallback) {
    const canvasRef = pageCanvasRefs[page.pageNumber - 1];

    var context = canvasRef?.current?.getContext('2d');

    if (!context || !viewer) return;

    const canvasWidth = canvasRef?.current?.width || 0;
    const canvasHeight = canvasRef?.current?.height || 0;

    context.save();
    context.translate(canvasWidth / 2, canvasHeight / 2);
    context.rotate(45 * (Math.PI / 180));
    context.globalCompositeOperation = 'multiply';
    context.textAlign = 'center';
    context.font = '100px sans-serif';
    context.fillStyle = 'rgba(0, 0, 0, .10)';

    // Measure the text
    const textMetrics = context.measureText(viewer?.viewer ?? 'Anonymous');
    const textWidth = textMetrics.width;
    const textHeight = 100; // This is approximate, you might need to adjust it based on your font size

    // Calculate scale to fit the text within the canvas
    const scale =
      Math.min(canvasWidth / textWidth, canvasHeight / textHeight) * 0.9; // 0.9 to add some padding

    // Apply scale
    context.scale(scale, scale);

    context.fillText(viewer?.viewer, 0, 0);
    context.restore();
  }

  /* ------------------------------- USE EFFECTS ------------------------------ */

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (pageRefs.length === 0) return;

        const max_entry = entries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );

        const pageIndex = pageRefs.findIndex(
          (ref) => ref?.current === max_entry.target
        );

        const newTimes = [...pageTimesRef.current];
        if (!!newTimes[newTimes.length - 1]) {
          newTimes[newTimes.length - 1].exitTime = Date.now();
        }
        newTimes.push({ pageNumber: pageIndex + 1, entryTime: Date.now() });

        pageTimesRef.current = newTimes;

        setActivePage(pageIndex + 1); // pages are 1-indexed
      },
      { threshold: 0.4 }
    );

    pageRefs.forEach((ref) => ref?.current && observer.observe(ref.current));

    // Scroll the thumbnail container
    if (thumbnailContainerRef.current) {
      const scrollTo = (activePage - 1) * thumbnailHeight;
      thumbnailContainerRef.current.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }

    return () => {
      pageRefs.forEach(
        (ref) => ref?.current && observer.unobserve(ref.current)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageRefs, activePage]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!document.hidden) {
        const flatPageTimes = pageTimesRef.current;
        if (flatPageTimes[flatPageTimes.length - 1]) {
          flatPageTimes[flatPageTimes.length - 1].exitTime = Date.now();
        }

        const filteredPageTimes = flatPageTimes.filter(
          (item) =>
            item.exitTime &&
            item.exitTime - item.entryTime > 200 &&
            item.pageNumber > 0
        );

        link_id &&
          (await updatePageTimes({
            pageTimes: filteredPageTimes,
            link_id: link_id as string,
          }));
      }
    }, 3000);

    // Cleanup: remove event listeners and clear interval
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------- SECURITY -------------------------------- */

  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);

    // Disable PrintScreen key
    const disablePrintScreen = (e: any) => {

      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error(
          'Screenshots are disabled for security reasons'
        );
      }

      // Disable Ctrl + P
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        toast.error(
          'Printing is disabled for security reasons'
        );
      }

      // Disable Ctrl + S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        toast.error(
          'Saving is disabled for security reasons'
        );
      }

    };
    document.addEventListener('keydown', disablePrintScreen);


    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disablePrintScreen);
    };
  }, []);

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <Document
      file={signedURL}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<Loader />}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="no-print hashdocs-scrollbar flex w-full flex-1 flex-row justify-center bg-gray-50"
      externalLinkTarget="_blank"
    >
      <div className="hidden flex-col py-2 lg:flex" ref={thumbnailContainerRef}>
        {Array.from({ length: numPagesRef.current }, (_, index) => (
          <div
            key={`page_${index + 1}`}
            className="flex flex-row justify-center gap-x-2 px-2 py-2"
          >
            <p
              className={clsx(
                activePage == index + 1 ? 'font-semibold text-blue-700' : ''
              )}
            >
              {index + 1}
            </p>
            <Thumbnail
              pageNumber={index + 1}
              //   width={thumbnailWidth}
              height={thumbnailHeight}
              onItemClick={handleThumbnailClick}
              loading={<Loader />}
              className={clsx(
                'rounded-sm ring-2 ring-offset-2',
                activePage == index + 1 ? 'ring-blue-700' : 'ring-gray-50'
              )}
            />
          </div>
        ))}
      </div>
      {window.innerWidth > 1024 ? (
        <div
          ref={scrollableElementRef}
          className="hashdocs-scrollbar hidden flex-1 flex-col items-center lg:flex"
        >
          <div className="sticky top-5 z-50 flex flex-row items-center justify-center gap-x-4 rounded-lg bg-white bg-opacity-90 px-3 py-2 shadow-lg">
            <div className="flex flex-row gap-x-2">
              <div
                className="flex items-center justify-center font-semibold text-gray-500"
                style={{ userSelect: 'none' }}
              >
                {'Page'}
              </div>
              <div
                className="flex items-center justify-center font-semibold text-gray-500"
                style={{ userSelect: 'none' }}
              >
                {activePage}
              </div>
              <div
                className="flex items-center justify-center font-semibold text-gray-500"
                style={{ userSelect: 'none' }}
              >
                {'of'}
              </div>
              <div
                className="flex items-center justify-center font-semibold text-gray-500"
                style={{ userSelect: 'none' }}
              >
                {numPagesRef.current}
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <MagnifyingGlassMinusIcon
                className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-900"
                onClick={() =>
                  setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.4))
                }
              />
              <MagnifyingGlassPlusIcon
                className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-900"
                onClick={() =>
                  setZoom((prevZoom) => Math.min(prevZoom + 0.2, 2))
                }
              />
              <div className="font-semibold text-gray-500">{`${Math.round(
                zoom * 100
              )}%`}</div>
            </div>
          </div>
          <div className="hidden flex-1 flex-col p-8 focus:outline-none lg:flex ">
            {Array.from({ length: numPagesRef.current }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                loading={<Loader />}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="my-4"
                // height={pageHeight}
                width={pageWidth}
                scale={zoom}
                inputRef={pageRefs[index]}
                canvasRef={pageCanvasRefs[index]}
                onRenderSuccess={onRenderSuccess}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollableElementRef}
          className="hashdocs-scrollbar flex flex-1 flex-col items-center lg:hidden"
        >
          {Array.from({ length: numPagesRef.current }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              loading={<Loader />}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              className="my-4"
              // height={pageHeight}
              width={window.innerWidth - 32}
              scale={zoom}
              inputRef={pageRefs[index]}
            />
          ))}
        </div>
      )}
    </Document>
  );
}
