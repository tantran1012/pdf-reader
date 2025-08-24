"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./styles.module.css";

const PDFViewer = dynamic(
  () =>
    import("../components/PdfViewer").then((mod) => ({
      default: mod.PDFViewer,
    })),
  {
    ssr: false,
  }
);

interface Bookmark {
  pageNumber?: number;
  title: string;
  items?: Bookmark[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const onDocumentLoadSuccess = async ({ numPages, _transport }: any) => {
    console.log("Document load success:", { numPages, _transport }); // Debug log
    setNumPages(numPages);
    const outline = await _transport.getOutline();
    console.log("🚀 ~ onDocumentLoadSuccess ~ outline:", outline);

    if (outline) {
      setBookmarks(outline);
    }
  };

  return (
    <main className={styles.container}>
      {!file ? (
        <div className={styles.dropZone}>
          <h1 className={styles.title}>Đọc PDF Nặng Đêy 👌</h1>
          <label className={styles.fileInputLabel}>
            <input
              type="file"
              onChange={onFileChange}
              accept=".pdf"
              className={styles.fileInput}
            />
            <span className={styles.fileInputButton}>Chọn file PDF</span>
          </label>
        </div>
      ) : (
        <PDFViewer
          file={file}
          bookmarks={bookmarks}
          numPages={numPages}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          fileName={file.name}
          onFileChange={onFileChange}
        />
      )}
    </main>
  );
}
