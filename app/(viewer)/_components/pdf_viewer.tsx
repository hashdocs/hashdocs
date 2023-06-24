"use client";
import Loader from "@/app/_components/navigation/loader";
import { classNames } from "@/app/_utils/classNames";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { RefObject, createRef, useEffect, useRef, useState } from "react";
import { Document, Page, Thumbnail } from "react-pdf";
import { pdfjs } from "react-pdf";
import { OnItemClickArgs, PageCallback } from "react-pdf/dist/cjs/shared/types";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({ signedURL }: { signedURL: string }) {
  const [numPages, setNumPages] = useState<number>(0);
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
  const [pageTimes, setPageTimes] = useState<
    { pageNumber: number; entryTime: number }[]
  >([]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollableElementRef = useRef<HTMLDivElement>(null);

  const { link_id } = useParams();

  /* -------------------------------- FUNCTIONS ------------------------------- */

  // Handle thumbnail click
  function handleThumbnailClick(args: OnItemClickArgs) {
    // setActivePage(args.pageNumber);
    scrollableElementRef.current?.scrollTo({ 
        top: pageRefs[args.pageNumber-1]?.current?.offsetTop!  - 136,
        behavior: 'instant' 
    });
  }

  // First call when the document loads to set the page count
  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);

    // Initialize an array of refs
    setPageRefs((oldRefs) =>
      Array(nextNumPages)
        .fill(null)
        .map((_, i) => oldRefs[i] || createRef())
    );
  }

  // Handle zoom in and out
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // limit max zoom level to 2
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // limit min zoom level to 0.5
  };

  /* ------------------------------- USE EFFECTS ------------------------------ */

  useEffect(() => {
    const scrollHandler = () => {
      setHasScrolled(true);
      scrollableElementRef.current?.removeEventListener('scroll', scrollHandler);
    };
    
    scrollableElementRef.current?.addEventListener('scroll', scrollHandler);
    
    return () => {
      scrollableElementRef.current?.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollableElementRef.current]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (hasScrolled && entry.isIntersecting && entry.intersectionRect.height > 0) {
            const pageIndex = pageRefs.findIndex(
              (ref) => ref?.current === entry.target
            );
            setPageTimes((oldTimes) => {
              return [...oldTimes, { pageNumber: activePage, entryTime: Date.now() }];
            });
            setActivePage(pageIndex + 1); // pages are 1-indexed
          }
        });
      },
      { threshold: 0.7 }
    );

    pageRefs.forEach((ref) => ref?.current && observer.observe(ref.current));

    // Scroll the thumbnail container
    if (thumbnailContainerRef.current) {
      const scrollTo = (activePage - 1) * thumbnailHeight;
      thumbnailContainerRef.current.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }

    return () => {
      pageRefs.forEach(
        (ref) => ref?.current && observer.unobserve(ref.current)
      );
    };
  }, [pageRefs, activePage, hasScrolled]);


  useEffect(() => {
    const flatPageTimes = pageTimes.map((pageTime, index) => {
      if (
        ((pageTimes[index + 1]?.entryTime ?? Date.now()) - pageTime.entryTime) <
        300
      )
        return;
      return {
        ...pageTime,
        exitTime: pageTimes[index + 1]?.entryTime || Date.now(),
      };
    }).filter((item) => item !== undefined);
    const interval = setInterval(async () => {
        link_id && await fetch(`/api/viewer/${link_id}`, {
          method: "PUT",
          body: JSON.stringify(flatPageTimes),
        });
    }, 3000);

    // Cleanup: remove event listeners and clear interval
    return () => {
      clearInterval(interval);
    };
  }, [pageTimes]);

  //   /* ---------------------------------- SCROLL HANDLER ---------------------------------- */
  //   useEffect(() => {
  //     let timeoutId: NodeJS.Timeout | null = null;

  //     const scrollListener = () => {
  //       // set state to scrolling
  //       setScrolling(true);

  //       // clear our timeout throughout the scroll
  //       timeoutId && clearTimeout(timeoutId);

  //       // set timeout to run function after scroll ends
  //       timeoutId = setTimeout(function () {
  //         setScrolling(false);
  //       }, 150); // wait for 150ms after the last scroll event
  //     };

  //     window.addEventListener("scroll", scrollListener);

  //     return () => {
  //       window.removeEventListener("scroll", scrollListener);
  //     };
  //   }, []);

  return (
    <Document
      file={signedURL}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<Loader />}
      onContextMenu={(e) => e.preventDefault()}
      className="no-print flex w-full flex-1 flex-row justify-center bg-shade-overlay"
      externalLinkTarget="_blank"
    >
      <div
        className="hashdocs-scrollbar hidden flex-col py-2 lg:flex"
        ref={thumbnailContainerRef}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div
            key={`page_${index + 1}`}
            className="flex flex-row justify-center gap-x-2 px-2 py-2"
          >
            <p
              className={classNames(
                activePage == index + 1
                  ? "font-semibold text-stratos-default"
                  : ""
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
              className={classNames(
                "rounded-sm ring-2 ring-offset-2",
                activePage == index + 1
                  ? "ring-stratos-default"
                  : "ring-shade-overlay"
              )}
            />
          </div>
        ))}
      </div>
      <div ref={scrollableElementRef} className="hashdocs-scrollbar hidden flex-1 flex-col items-center lg:flex">
        <div className="sticky top-5 z-50 flex flex-row items-center justify-center gap-x-4 rounded-lg bg-white bg-opacity-90 px-3 py-2 shadow-lg">
          <div className="flex flex-row gap-x-2">
            <div
              className="flex items-center justify-center font-semibold text-shade-pencil-light"
              style={{ userSelect: "none" }}
            >
              {"Page"}
            </div>
            <div
              className="flex items-center justify-center font-semibold text-shade-pencil-light"
              style={{ userSelect: "none" }}
            >
              {activePage}
            </div>
            <div
              className="flex items-center justify-center font-semibold text-shade-pencil-light"
              style={{ userSelect: "none" }}
            >
              {"of"}
            </div>
            <div
              className="flex items-center justify-center font-semibold text-shade-pencil-light"
              style={{ userSelect: "none" }}
            >
              {numPages}
            </div>
          </div>
          <div className="flex flex-row gap-x-2">
            <MagnifyingGlassPlusIcon
              className="h-6 w-6 cursor-pointer text-shade-pencil-light hover:text-shade-pencil-black"
              onClick={handleZoomIn}
            />
            <MagnifyingGlassMinusIcon
              className="h-6 w-6 cursor-pointer text-shade-pencil-light hover:text-shade-pencil-black"
              onClick={handleZoomOut}
            />
          </div>
        </div>
        <div className="hidden flex-1 flex-col p-8 focus:outline-none lg:flex ">
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              loading={<Loader />}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="my-4"
              height={pageHeight}
              width={pageWidth}
              scale={zoom}
              inputRef={pageRefs[index]}
            />
          ))}
        </div>
      </div>
    </Document>
  );
}
