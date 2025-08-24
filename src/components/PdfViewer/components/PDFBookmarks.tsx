import React from "react";

interface PDFBookmarksProps {
  bookmarks: any[] | null;
  onBookmarkClick: (dest: any) => void;
  activeBookmarkIndex: string | null;
  styles: any;
}

export const PDFBookmarks: React.FC<PDFBookmarksProps> = ({
  bookmarks,
  onBookmarkClick,
  activeBookmarkIndex,
  styles,
}) => {
  const renderBookmarks = (
    bookmarkList: any[],
    parentIndex = ""
  ): React.ReactNode => {
    return bookmarkList.map((bookmark, index) => {
      const bookmarkIndex = parentIndex
        ? `${parentIndex}-${index}`
        : `${index}`;
      const isActive = activeBookmarkIndex === bookmarkIndex;

      return (
        <li key={index} className={styles.bookmarkItem}>
          <button
            onClick={() => onBookmarkClick(bookmark.dest)}
            className={`${styles.bookmarkButton} ${
              isActive ? styles.bookmarkActive : ""
            }`}
            style={
              isActive
                ? {
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: "600",
                    borderLeft: "3px solid #1976d2",
                    paddingLeft: "5px",
                  }
                : {}
            }
          >
            {bookmark.title}
          </button>
          {bookmark.items && bookmark.items.length > 0 && (
            <ul className={styles.nestedBookmarks}>
              {renderBookmarks(bookmark.items, bookmarkIndex)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className={styles.bookmarksContainer}>
      <div className={styles.bookmarks}>
        <h2 className={styles.bookmarksTitle}>Mục lục</h2>
        {bookmarks && bookmarks.length > 0 ? (
          <ul className={styles.bookmarksList}>{renderBookmarks(bookmarks)}</ul>
        ) : (
          <p>Không có mục lục</p>
        )}
      </div>
    </div>
  );
};
