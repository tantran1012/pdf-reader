import React from "react";

interface PDFToolbarProps {
  fileName: string;
  showBookmarks: boolean;
  scale: number;
  isFullScreen: boolean;
  onToggleBookmarks: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoom: (type: "in" | "out" | "reset") => void;
  onToggleFullScreen: () => void;
  styles: any;
}

export const PDFToolbar: React.FC<PDFToolbarProps> = ({
  fileName,
  showBookmarks,
  scale,
  isFullScreen,
  onToggleBookmarks,
  onFileChange,
  onZoom,
  onToggleFullScreen,
  styles,
}) => (
  <div className={styles.toolbar}>
    <div className={styles.toolbarSection}>
      <button
        onClick={onToggleBookmarks}
        className={`${styles.toolbarButton} ${
          showBookmarks ? styles.active : ""
        }`}
        title={showBookmarks ? "Ẩn mục lục" : "Hiện mục lục"}
      >
        ☰
      </button>
    </div>

    <div className={styles.toolbarSection}>
      <span className={styles.fileName} title={fileName}>
        {fileName}
      </span>
    </div>

    <div className={`${styles.toolbarSection} ${styles.toolbarRight}`}>
      <label className={styles.fileInputLabel}>
        <input
          type="file"
          onChange={onFileChange}
          accept=".pdf"
          className={styles.fileInput}
        />
        <span className={styles.toolbarButton}>Chọn PDF</span>
      </label>

      <div className={styles.zoomControls}>
        <button
          onClick={() => onZoom("out")}
          className={styles.toolbarButton}
          title="Thu nhỏ"
        >
          −
        </button>
        <button
          onClick={() => onZoom("reset")}
          className={styles.toolbarButton}
          title="Kích thước mặc định"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={() => onZoom("in")}
          className={styles.toolbarButton}
          title="Phóng to"
        >
          +
        </button>
      </div>

      <button
        onClick={onToggleFullScreen}
        className={styles.toolbarButton}
        title={isFullScreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      >
        {isFullScreen ? "⨉" : "⤢"}
      </button>
    </div>
  </div>
);
