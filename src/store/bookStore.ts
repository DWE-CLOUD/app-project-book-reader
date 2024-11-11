import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Annotation {
  page: number;
  text: string;
  color: string;
  timestamp: number;
}

interface Highlight {
  page: number;
  content: string;
  color: string;
  position: { x: number; y: number };
}

interface ReadingProgress {
  totalPages: number;
  lastPage: number;
  lastRead: number;
  timeSpent: number;
}

interface BookState {
  currentBook: string | null;
  bookmarks: Record<string, number[]>;
  recentBooks: string[];
  annotations: Record<string, Annotation[]>;
  highlights: Record<string, Highlight[]>;
  readingProgress: Record<string, ReadingProgress>;
  isDarkMode: boolean;
  searchQuery: string;
  setCurrentBook: (book: string) => void;
  addBookmark: (book: string, page: number) => void;
  removeBookmark: (book: string, page: number) => void;
  addRecentBook: (book: string) => void;
  addAnnotation: (book: string, annotation: Annotation) => void;
  addHighlight: (book: string, highlight: Highlight) => void;
  updateReadingProgress: (book: string, progress: Partial<ReadingProgress>) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      currentBook: null,
      bookmarks: {},
      recentBooks: [],
      annotations: {},
      highlights: {},
      readingProgress: {},
      isDarkMode: false,
      searchQuery: '',
      setCurrentBook: (book) =>
        set(() => ({ currentBook: book })),
      addBookmark: (book, page) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [book]: [...(state.bookmarks[book] || []), page],
          },
        })),
      removeBookmark: (book, page) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [book]: state.bookmarks[book]?.filter((p) => p !== page) || [],
          },
        })),
      addRecentBook: (book) =>
        set((state) => ({
          recentBooks: [book, ...state.recentBooks.filter((b) => b !== book)].slice(0, 5),
        })),
      addAnnotation: (book, annotation) =>
        set((state) => ({
          annotations: {
            ...state.annotations,
            [book]: [...(state.annotations[book] || []), annotation],
          },
        })),
      addHighlight: (book, highlight) =>
        set((state) => ({
          highlights: {
            ...state.highlights,
            [book]: [...(state.highlights[book] || []), highlight],
          },
        })),
      updateReadingProgress: (book, progress) =>
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            [book]: {
              ...state.readingProgress[book],
              ...progress,
            },
          },
        })),
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchQuery: (query) =>
        set(() => ({ searchQuery: query })),
    }),
    {
      name: 'book-storage',
    }
  )
);