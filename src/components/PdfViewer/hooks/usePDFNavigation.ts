import { useCallback, useEffect, useRef, useState } from "react";

export const usePDFNavigation = (
  containerRef: React.RefObject<HTMLDivElement>,
  numPages: number | null
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const calculateVisiblePages = useCallback(
    (current: number, total: number | null) => {
      if (!total) return [];
      const range = 5;
      const start = Math.max(1, current - range);
      const end = Math.min(total, current + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    []
  );

  const debouncedSetVisiblePages = useCallback(
    (pageNumber: number) => {
      const timeoutId = setTimeout(() => {
        setVisiblePages(calculateVisiblePages(pageNumber, numPages));
      }, 100);
      return () => clearTimeout(timeoutId);
    },
    [calculateVisiblePages, numPages]
  );

  const scrollToPage = useCallback((pageNumber: number) => {
    if (!containerRef.current) return;
    
    const element = containerRef.current.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNumber);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const pages = container.getElementsByClassName("pageContainer");

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      const rect = page.getBoundingClientRect();

      if (rect.top <= containerRect.bottom && rect.bottom >= containerRect.top) {
        const pageNumber = Number(page.dataset.pageNumber);
        setCurrentPage(pageNumber);
        debouncedSetVisiblePages(pageNumber);
        break;
      }
    }
  }, [debouncedSetVisiblePages, containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = Number((entry.target as HTMLElement).dataset.pageNumber);
            setCurrentPage(pageNumber);
            debouncedSetVisiblePages(pageNumber);
          }
        });
      },
      {
        root: container,
        rootMargin: "100px 0px",
        threshold: 0.1,
      }
    );

    const elements = container.getElementsByClassName("pageContainer");
    Array.from(elements).forEach((element) => {
      observerRef.current?.observe(element);
    });

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, debouncedSetVisiblePages, containerRef]);

  return {
    currentPage,
    visiblePages,
    setCurrentPage,
    setVisiblePages: (pages: number[]) => setVisiblePages(pages),
    scrollToPage,
    calculateVisiblePages,
  };
};