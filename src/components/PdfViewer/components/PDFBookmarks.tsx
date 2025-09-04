import { useCallback, useState } from "react";

interface PDFBookmarksProps {
  bookmarks: any[] | null;
  onBookmarkClick: (bookmark: any) => Promise<void>;
  activeBookmarkIndex: string | null;
  styles: any;
}

export const PDFBookmarks = ({
  bookmarks,
  onBookmarkClick,
  activeBookmarkIndex,
  styles,
}: PDFBookmarksProps) => {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = useCallback(
    (e: React.MouseEvent, bookmarkId: string) => {
      e.stopPropagation(); // Ngăn sự kiện click lan tỏa
      setExpandedItems((prev) => ({
        ...prev,
        [bookmarkId]: !prev[bookmarkId],
      }));
    },
    []
  );

  const renderBookmarks = useCallback(
    (items: any[] | null, level = 0) => {
      if (!items) return null;

      return items.map((bookmark, index) => {
        // const bookmarkId = `${level}-${index}`;
        const bookmarkId = level ? `${level}-${index}` : `${index}`;
        const isActive = activeBookmarkIndex === bookmarkId;
        const hasChildren = bookmark.items && bookmark.items.length > 0;
        const isExpanded = expandedItems[bookmarkId];

        return (
          <li key={bookmarkId} className={styles.bookmarkItem}>
            <div className={styles.bookmarkRow}>
              {hasChildren && (
                <button
                  className={`${styles.bookmarkToggle} ${
                    isExpanded ? styles.expanded : ""
                  } `}
                  onClick={(e) => toggleExpand(e, bookmarkId)}
                  title={isExpanded ? "Thu gọn" : "Mở rộng"}
                >
                  ▶
                </button>
              )}
              <button
                onClick={() => onBookmarkClick(bookmark.dest)}
                className={`${styles.bookmarkButton} ${
                  isActive ? styles.active : ""
                }`}
                title={bookmark.title}
              >
                {bookmark.title}
              </button>
            </div>
            {hasChildren && (
              <ul
                className={`${styles.nestedBookmarks} ${
                  !isExpanded ? styles.collapsed : ""
                }`}
              >
                {renderBookmarks(bookmark.items, level + 1)}
              </ul>
            )}
          </li>
        );
      });
    },
    [expandedItems, onBookmarkClick, styles, toggleExpand, activeBookmarkIndex]
  );

  return (
    <div className={`${styles.bookmarksContainer}`}>
      <div className={styles.bookmarks}>
        <h2 className={styles.bookmarksTitle}>Mục lục</h2>
        {bookmarks && bookmarks.length > 0 ? (
          <ul className={styles.bookmarksList}>{renderBookmarks(bookmarks)}</ul>
        ) : (
          <p className={styles.noBookmarks}>Không có mục lục</p>
        )}
      </div>
    </div>
  );
};
