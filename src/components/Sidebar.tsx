import React from 'react';
import { Book, BookMarked, Upload } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

export default function Sidebar() {
  const { recentBooks, bookmarks, setCurrentBook, currentBook } = useBookStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentBook(url);
    }
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg p-4 flex flex-col">
      <div className="mb-8">
        <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
          <Upload className="w-5 h-5 mr-2" />
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-6">
        <h2 className="flex items-center text-gray-600 font-semibold mb-2">
          <Book className="w-4 h-4 mr-2" />
          Recent Books
        </h2>
        <ul className="space-y-2">
          {recentBooks.map((book, index) => (
            <li key={index}>
              <button
                onClick={() => setCurrentBook(book)}
                className={`w-full text-left px-2 py-1 rounded text-sm ${
                  currentBook === book ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {book.split('/').pop()?.slice(0, 20)}...
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="flex items-center text-gray-600 font-semibold mb-2">
          <BookMarked className="w-4 h-4 mr-2" />
          Bookmarks
        </h2>
        <ul className="space-y-2">
          {Object.entries(bookmarks).map(([book, pages]) => (
            <li key={book} className="mb-2">
              <p className="text-sm text-gray-500 mb-1">
                {book.split('/').pop()?.slice(0, 20)}...
              </p>
              <div className="flex flex-wrap gap-1">
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentBook(book)}
                    className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Page {page}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}