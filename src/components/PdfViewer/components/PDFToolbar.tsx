import React from "react";

interface PDFToolbarProps {
  fileName: string;
  showBookmarks: boolean;
  scale: number;
  isFullScreen: boolean;
  isToolbarHidden: boolean;
  viewMode: "default" | "drag" | "select";
  onToggleViewMode: () => void;
  onToggleBookmarks: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoom: (type: "in" | "out" | "reset") => void;
  onToggleFullScreen: () => void;
  styles: any;
}

export const PDFToolbar = ({
  fileName,
  showBookmarks,
  scale,
  isFullScreen,
  isToolbarHidden,
  onToggleBookmarks,
  onFileChange,
  onZoom,
  onToggleFullScreen,
  styles,
  viewMode,
  onToggleViewMode,
}: PDFToolbarProps) => (
  <div className={`${styles.toolbar} ${isToolbarHidden ? styles.hidden : ""}`}>
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
      <button
        onClick={onToggleViewMode}
        className={`${styles.toolbarButton} ${styles.viewModeButton}`}
        title={
          viewMode === "default"
            ? "Chế độ mặc định"
            : viewMode === "drag"
            ? "Chế độ kéo thả"
            : "Chế độ chọn văn bản"
        }
      >
        {viewMode === "default" ? "☝" : viewMode === "drag" ? "✋" : "✒"}
      </button>
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
