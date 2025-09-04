import styles from "@/app/styles.module.css";
import { useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFBookmarks } from "./components/PDFBookmarks";
import { PDFPageRenderer } from "./components/PDFPageRenderer";
import { PDFToolbar } from "./components/PDFToolbar";
import { usePDFBookmarks } from "./hooks/usePDFBookmarks";
import { usePDFControls } from "./hooks/usePDFControls";
import { usePDFDrag } from "./hooks/usePDFDrag";
import { usePDFNavigation } from "./hooks/usePDFNavigation";

pdfjs.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.mjs`;

interface PDFViewerProps {
  file: File | null;
  bookmarks: any[] | null;
  numPages: number | null;
  onDocumentLoadSuccess: ({ numPages, _transport }: any) => void;
  fileName: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PDFViewer({
  file,
  bookmarks,
  numPages,
  onDocumentLoadSuccess,
  fileName,
  onFileChange,
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>([] as unknown as HTMLDivElement);
  const [pdfDocument, setPdfDocument] = useState<any>(null);

  // Custom hooks
  const {
    scale,
    isFullScreen,
    isToolbarHidden,
    showBookmarks,
    pdfViewerRef,
    viewMode,
    toggleViewMode,
    handleZoom,
    toggleFullScreen,
    toggleBookmarks,
  } = usePDFControls();
  const { handleMouseDown, handleMouseUp } = usePDFDrag(containerRef, scale);
  const {
    currentPage,
    visiblePages,
    setCurrentPage,
    setVisiblePages,
    scrollToPage,
    calculateVisiblePages,
  } = usePDFNavigation(containerRef, numPages);
  const { handleBookmarkClick, activeBookmarkIndex } = usePDFBookmarks(
    pdfDocument,
    scrollToPage,
    bookmarks,
    currentPage
  );

  const handleDocumentLoadSuccess = (result: any) => {
    setPdfDocument(result);
    onDocumentLoadSuccess(result);
    setCurrentPage(1);
    setVisiblePages(calculateVisiblePages(1, result.numPages));
  };

  return (
    <div ref={pdfViewerRef} className={styles.pdfViewer}>
      <PDFToolbar
        fileName={fileName}
        showBookmarks={showBookmarks}
        scale={scale}
        isFullScreen={isFullScreen}
        isToolbarHidden={isToolbarHidden}
        onToggleBookmarks={toggleBookmarks}
        onFileChange={onFileChange}
        onZoom={handleZoom}
        onToggleFullScreen={toggleFullScreen}
        styles={styles}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
      />

      <div
        className={`${styles.contentContainer} ${
          isToolbarHidden ? styles.fullHeight : ""
        }`}
      >
        {showBookmarks && (
          <PDFBookmarks
            bookmarks={bookmarks}
            onBookmarkClick={handleBookmarkClick}
            activeBookmarkIndex={activeBookmarkIndex}
            styles={styles}
          />
        )}

        <div
          ref={containerRef}
          className={`${styles.documentContainer}`}
          data-view-mode={viewMode}
          onMouseDown={(e) => {
            if (viewMode === "drag" || (viewMode === "default" && scale > 1)) {
              handleMouseDown(e);
            }
          }}
          onMouseLeave={handleMouseUp}
        >
          <Document
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            className={styles.document}
          >
            {numPages &&
              Array.from({ length: numPages }, (_, index) => {
                const pageNumber = index + 1;
                const shouldRender = visiblePages.includes(pageNumber);

                return (
                  <PDFPageRenderer
                    key={pageNumber}
                    pageNumber={pageNumber}
                    numPages={numPages}
                    scale={scale}
                    shouldRender={shouldRender}
                    styles={styles}
                  />
                );
              })}
          </Document>
        </div>
      </div>
    </div>
  );
}
