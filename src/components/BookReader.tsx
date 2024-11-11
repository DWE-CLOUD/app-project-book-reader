import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Upload,
  Search,
  Moon,
  Sun,
  Clock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import SearchBar from './SearchBar';
import AnnotationPanel from './AnnotationPanel';
import ReadingStats from './ReadingStats';

export default function BookReader() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(800);
  const {
    currentBook,
    addBookmark,
    bookmarks,
    removeBookmark,
    isDarkMode,
    toggleDarkMode,
    updateReadingProgress,
  } = useBookStore();

  const updateWidth = useCallback(() => {
    const container = document.getElementById('pdf-container');
    if (container) {
      setWidth(container.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    let startTime = Date.now();
    return () => {
      if (currentBook) {
        updateReadingProgress(currentBook, {
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          lastRead: Date.now(),
        });
      }
    };
  }, [currentBook, pageNumber, updateReadingProgress]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (currentBook) {
      updateReadingProgress(currentBook, {
        totalPages: numPages,
        lastPage: pageNumber,
      });
    }
  };

  const isBookmarked =
    currentBook && bookmarks[currentBook]?.includes(pageNumber);

  const toggleBookmark = () => {
    if (!currentBook) return;
    if (isBookmarked) {
      removeBookmark(currentBook, pageNumber);
    } else {
      addBookmark(currentBook, pageNumber);
    }
  };

  const adjustScale = (delta) => {
    setScale((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  if (!currentBook) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[calc(100vh-2rem)] ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg`}
      >
        <div className="text-center">
          <Upload
            className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`}
          />
          <p
            className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            No book selected
          </p>
          <p
            className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Upload a PDF to start reading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-[calc(100vh-2rem)] transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } disabled:opacity-50 transition-colors`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span
            className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } disabled:opacity-50 transition-colors`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustScale(-0.1)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span
              className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => adjustScale(0.1)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <SearchBar />

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isBookmarked
                ? 'text-blue-500'
                : isDarkMode
                ? 'text-gray-300'
                : 'text-gray-500'
            }`}
          >
            <Bookmark className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <Search className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <Clock className="w-6 h-6" />
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-4">
        <div id="pdf-container" className="flex-1 overflow-auto">
          <Document
            file={currentBook}
            onLoadSuccess={onDocumentLoadSuccess}
            className={`max-w-full ${isDarkMode ? 'filter invert' : ''}`}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              className="mx-auto"
              width={width * 0.8}
              scale={scale}
            />
          </Document>
        </div>

        {(showAnnotations || showStats) && (
          <div className="flex flex-col gap-4 w-80">
            {showAnnotations && <AnnotationPanel pageNumber={pageNumber} />}
            {showStats && <ReadingStats />}
          </div>
        )}
      </div>
    </div>
  );
}
