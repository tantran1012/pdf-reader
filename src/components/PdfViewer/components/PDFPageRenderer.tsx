import React from "react";
import { Page } from "react-pdf";

interface PDFPageRendererProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  shouldRender: boolean;
  styles: any;
}

export const PDFPageRenderer: React.FC<PDFPageRendererProps> = ({
  pageNumber,
  numPages,
  scale,
  shouldRender,
  styles,
}) => (
  <div
    key={`page_${pageNumber}`}
    className={`${styles.pageContainer} pageContainer`}
    data-page-number={pageNumber}
    style={
      !shouldRender
        ? {
            height: "1000px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }
        : undefined
    }
  >
    {shouldRender ? (
      <>
        <p className={styles.pageNumber}>
          Trang {pageNumber} / {numPages}
        </p>
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={true}
          renderTextLayer={true}
          className={styles.page}
          scale={scale}
          loading={
            <div className={styles.pageLoading}>
              Đang tải trang {pageNumber}...
            </div>
          }
          error={null}
          onLoadError={(error: Error) => {
            if (!error.message.includes("cancelled")) {
              console.error(`Error loading page ${pageNumber}:`, error);
            }
          }}
        />
      </>
    ) : (
      <div className={styles.pagePlaceholder}>Trang {pageNumber}</div>
    )}
  </div>
);
