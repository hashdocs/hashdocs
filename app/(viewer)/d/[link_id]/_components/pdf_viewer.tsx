"use client";
import Loader from "@/app/_components/navigation/loader";
import { classNames } from "@/app/_utils/classNames";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page, Thumbnail } from "react-pdf";
import { pdfjs } from "react-pdf";
import { OnItemClickArgs, PageCallback } from "react-pdf/dist/cjs/shared/types";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({signedURL}:{signedURL:string}) {

    console.log('pageurl',signedURL);

  const [numPages, setNumPages] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [scrollY, setScrollY] = useState<number>(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const pageHeight = window.innerHeight * 0.8;
  const pageWidth = window.innerWidth * 0.65;
  const thumbnailWidth = window.innerWidth * 0.15;
  const thumbnailHeight = window.innerHeight * 0.15;
  const [zoom, setZoom] = useState(1);

  // Handle thumbnail click
  function handleThumbnailClick(args: OnItemClickArgs) {
    setActivePage(args.pageNumber);
  }

  // Handle key down
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      setActivePage((prevActivePage) => {
        return Math.min(numPages, prevActivePage + 1);
      });
    }
  }

  // Handle key up
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      setActivePage((prevActivePage) => {
        return Math.max(1, prevActivePage - 1);
      });
    }
  }

  // Fires when active page changes
  useEffect(() => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollTop =
        (activePage - 4) * window.innerHeight * 0.18;
    }
  }, [activePage]);

  // First call when the document loads to set the page count
  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);
  }

  //TODO: Function handler when a page is rendered
  function handleRenderSuccess(page: PageCallback) {
    // console.log(page._pageIndex);
  }

  // Main scroll handler
  function handleScroll(e: any) {
    setScrollY((prevScrollY) => {
      const nextScrollY = prevScrollY + e.deltaY;

      if (nextScrollY > 60) {
        if (activePage < numPages) {
          setActivePage(activePage + 1);
        }
        return 0;
      } else if (nextScrollY < -60) {
        if (activePage > 1) {
          setActivePage(activePage - 1);
        }
        return 0;
      }
      return nextScrollY;
    });
  }

  // Handle zoom in and out
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // limit max zoom level to 2
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // limit min zoom level to 0.5
  };

  // Use effect to handle key down and up
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    const keyUpHandler = (e: KeyboardEvent) => {
      handleKeyUp(e);
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [numPages]);

  return (
    <Document
      file={signedURL}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<Loader />}
      onContextMenu={(e) => e.preventDefault()}
      className="no-print flex w-full flex-1 flex-row bg-shade-overlay justify-center"
      externalLinkTarget="_blank"
    >
      <div
        className="hashdocs-scrollbar hidden flex-col py-2 lg:flex"
        ref={thumbnailRef}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div
            key={`page_${index + 1}`}
            className="flex flex-row justify-center gap-x-2 px-2 py-2"
          >
            <p className={classNames(activePage == index + 1 ? "text-stratos-default font-semibold" : "")}>{index + 1}</p>
            <Thumbnail
              pageNumber={index + 1}
              // width={window.innerWidth * 0.15}
              height={thumbnailHeight}
              onItemClick={handleThumbnailClick}
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
      <div className="hashdocs-scrollbar hidden flex-1 flex-col items-center  lg:flex">
        <div className="mt-4 flex flex-row justify-center items-center gap-x-4 rounded-lg bg-white px-3 py-2 shadow-lg">
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
            <ArrowDownCircleIcon
              onClick={(e) =>
                setActivePage((prevActivePage) => {
                  return Math.min(numPages, prevActivePage + 1);
                })
              }
              className="h-6 w-6 cursor-pointer  text-shade-pencil-light hover:text-shade-pencil-black"
            />
            <ArrowUpCircleIcon
              onClick={(e) =>
                setActivePage((prevActivePage) => {
                  return Math.max(1, prevActivePage - 1);
                })
              }
              className="h-6 w-6 cursor-pointer text-shade-pencil-light hover:text-shade-pencil-black"
            />
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
        <div
          className="hidden flex-1 flex-col items-center justify-center overflow-auto p-8 focus:outline-none lg:flex "
          onWheel={handleScroll}
        >
          <Page
            key={`page_${activePage}`}
            pageNumber={activePage}
            onRenderSuccess={handleRenderSuccess}
            loading={<Loader />}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            height={pageHeight}
            // width={pageWidth}
            scale={zoom}
          />
        </div>
      </div>
    </Document>
  );
}
