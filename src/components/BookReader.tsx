import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Bookmark, ChevronLeft, ChevronRight, Upload, Search, Moon, Sun, Clock } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import SearchBar from './SearchBar';
import AnnotationPanel from './AnnotationPanel';
import ReadingStats from './ReadingStats';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BookReader() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { 
    currentBook, 
    addBookmark, 
    bookmarks, 
    removeBookmark,
    isDarkMode,
    toggleDarkMode,
    updateReadingProgress
  } = useBookStore();

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
  }, [currentBook, pageNumber]);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (currentBook) {
      updateReadingProgress(currentBook, {
        totalPages: numPages,
        lastPage: pageNumber,
      });
    }
  };

  const isBookmarked = currentBook && bookmarks[currentBook]?.includes(pageNumber);

  const toggleBookmark = () => {
    if (!currentBook) return;
    if (isBookmarked) {
      removeBookmark(currentBook, pageNumber);
    } else {
      addBookmark(currentBook, pageNumber);
    }
  };

  if (!currentBook) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <p className="text-xl">No book selected</p>
          <p className="text-sm text-gray-400 mt-2">Upload a PDF to start reading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-6xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50 transition-colors`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Page {pageNumber} of {numPages}
            </span>
            
            <button
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50 transition-colors`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <SearchBar />
            
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isBookmarked ? 'text-blue-500' : isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              <Bookmark className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Search className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Clock className="w-6 h-6" />
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Document
              file={currentBook}
              onLoadSuccess={onDocumentLoadSuccess}
              className={`max-w-full ${isDarkMode ? 'filter invert' : ''}`}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                className="shadow-xl rounded-lg"
              />
            </Document>
          </div>

          {showAnnotations && (
            <AnnotationPanel pageNumber={pageNumber} />
          )}

          {showStats && (
            <ReadingStats />
          )}
        </div>
      </div>
    </div>
  );
}