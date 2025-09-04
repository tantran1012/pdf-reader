import { useState } from 'react';

export type RenderMode = 'partial' | 'all';

export const usePDFSettings = () => {
  const [renderMode, setRenderMode] = useState<RenderMode>('partial');
  const [renderRange, setRenderRange] = useState(2); // Number of pages to render before/after
  const [jumpToPage, setJumpToPage] = useState<string>('');

  const handleRenderModeChange = (mode: RenderMode) => {
    setRenderMode(mode);
  };

  const handleRangeChange = (range: number) => {
    setRenderRange(Math.max(1, range));
  };

  const handleJumpToPage = (pageNumber: string) => {
    setJumpToPage(pageNumber);
  };

  return {
    renderMode,
    renderRange,
    jumpToPage,
    handleRenderModeChange,
    handleRangeChange,
    handleJumpToPage
  };
};