import { useCallback, useEffect, useRef, useState } from "react";

export const usePDFControls = () => {
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  const handleZoom = useCallback((type: "in" | "out" | "reset") => {
    switch (type) {
      case "in":
        setScale((prev) => Math.min(prev + 0.25, 5.0));
        break;
      case "out":
        setScale((prev) => Math.max(prev - 0.25, 0.5));
        break;
      case "reset":
        setScale(1);
        break;
    }
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      pdfViewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  const toggleBookmarks = useCallback(() => {
    setShowBookmarks((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return {
    scale,
    isFullScreen,
    showBookmarks,
    pdfViewerRef,
    handleZoom,
    toggleFullScreen,
    toggleBookmarks,
  };
};