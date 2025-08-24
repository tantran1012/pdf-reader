import { useCallback, useEffect, useState } from "react";

interface BookmarkPageMap {
  [bookmarkIndex: string]: number;
}

export const usePDFBookmarks = (
  pdfDocument: any, 
  scrollToPage: (page: number) => void,
  bookmarks: any[] | null,
  currentPage: number
) => {
  const [bookmarkPageMap, setBookmarkPageMap] = useState<BookmarkPageMap>({});
  const [activeBookmarkIndex, setActiveBookmarkIndex] = useState<string | null>(null);

  const getPageNumber = useCallback(
    async (dest: any) => {
      if (!pdfDocument || !Array.isArray(dest)) return null;

      try {
        const ref = dest[0];
        const page = await pdfDocument.getPageIndex(ref);
        return page + 1;
      } catch (error) {
        console.error("Error resolving page number:", error);
        return null;
      }
    },
    [pdfDocument]
  );

  const handleBookmarkClick = useCallback(
    async (dest: any) => {
      if (dest) {
        const pageNumber = await getPageNumber(dest);
        if (pageNumber) {
          scrollToPage(pageNumber);
        }
      }
    },
    [getPageNumber, scrollToPage]
  );

  // Tạo map từ bookmark index đến page number
  const createBookmarkPageMap = useCallback(
    async (bookmarkList: any[], parentIndex = "") => {
      const map: BookmarkPageMap = {};
      
      for (let i = 0; i < bookmarkList.length; i++) {
        const bookmark = bookmarkList[i];
        const bookmarkIndex = parentIndex ? `${parentIndex}-${i}` : `${i}`;
        
        if (bookmark.dest) {
          const pageNumber = await getPageNumber(bookmark.dest);
          if (pageNumber) {
            map[bookmarkIndex] = pageNumber;
          }
        }
        
        // Xử lý nested bookmarks
        if (bookmark.items && bookmark.items.length > 0) {
          const nestedMap = await createBookmarkPageMap(bookmark.items, bookmarkIndex);
          Object.assign(map, nestedMap);
        }
      }
      
      return map;
    },
    [getPageNumber]
  );

  // Tính toán active bookmark dựa trên current page
  const calculateActiveBookmark = useCallback(() => {
    if (!bookmarkPageMap || Object.keys(bookmarkPageMap).length === 0) return null;

    let closestBookmark: string | null = null;
    let closestDistance = Infinity;

    // Tìm bookmark có page number gần nhất và <= current page
    Object.entries(bookmarkPageMap).forEach(([index, pageNumber]) => {
      if (pageNumber <= currentPage) {
        const distance = currentPage - pageNumber;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBookmark = index;
        }
      }
    });

    return closestBookmark;
  }, [bookmarkPageMap, currentPage]);

  // Update bookmark-page mapping khi bookmarks hoặc pdfDocument thay đổi
  useEffect(() => {
    if (bookmarks && pdfDocument) {
      createBookmarkPageMap(bookmarks).then((map) => {
        setBookmarkPageMap(map);
      });
    }
  }, [bookmarks, pdfDocument, createBookmarkPageMap]);

  // Update active bookmark khi current page thay đổi
  useEffect(() => {
    const activeBookmark = calculateActiveBookmark();
    setActiveBookmarkIndex(activeBookmark);
  }, [calculateActiveBookmark]);

  return { 
    handleBookmarkClick, 
    activeBookmarkIndex,
    bookmarkPageMap 
  };
};
