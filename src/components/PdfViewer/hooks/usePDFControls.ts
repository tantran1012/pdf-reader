import { useCallback, useEffect, useRef, useState } from 'react';

export const usePDFControls = () => {
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [isToolbarHidden, setIsToolbarHidden] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'drag' | 'select'>('default');
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Change to useRef


  const handleZoom = (type: "in" | "out" | "reset") => {
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
  };

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      switch (prev) {
        case 'default':
          return 'drag';
        case 'drag':
          return 'select';
        default:
          return 'default';
      }
    });
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      pdfViewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleBookmarks = () => {
    setShowBookmarks((prev) => !prev);
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullScreenMode = document.fullscreenElement !== null;
      setIsFullScreen(isFullScreenMode);
      
      // Reset toolbar visibility when exiting fullscreen
      if (!isFullScreenMode) {
        setIsToolbarHidden(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Update mouse movement handler
  useEffect(() => {
    if (!isFullScreen) {
      setIsToolbarHidden(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setIsToolbarHidden(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsToolbarHidden(true);
        }, 2000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isFullScreen]);

  return {
    scale,
    isFullScreen,
    showBookmarks,
    isToolbarHidden,
    pdfViewerRef,
    viewMode,
    toggleViewMode,
    handleZoom,
    toggleFullScreen,
    toggleBookmarks,
  };
};