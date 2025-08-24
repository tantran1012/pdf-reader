export interface PDFViewerProps {
  file: File | null;
  bookmarks: any[] | null;
  numPages: number | null;
  onDocumentLoadSuccess: ({ numPages, _transport }: any) => void;
  fileName: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ToolbarProps {
  fileName: string;
  showBookmarks: boolean;
  setShowBookmarks: (show: boolean) => void;
  scale: number;
  handleZoom: (type: "in" | "out" | "reset") => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface BookmarksProps {
  bookmarks: any[] | null;
  onBookmarkClick: (dest: any) => Promise<void>;
}