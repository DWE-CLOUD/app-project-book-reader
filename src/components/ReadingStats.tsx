import React from 'react';
import { useBookStore } from '../store/bookStore';
import { Clock, BookOpen, BarChart } from 'lucide-react';

export default function ReadingStats() {
  const { currentBook, readingProgress, isDarkMode } = useBookStore();
  
  const stats = currentBook ? readingProgress[currentBook] : null;
  
  if (!stats) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const progress = Math.round((stats.lastPage / stats.totalPages) * 100);

  return (
    <div className={`w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2" />
        Reading Stats
      </h3>

      <div className="space-y-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Progress</span>
            <span className="text-blue-500 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Time Spent</span>
            </div>
            <p className="text-lg font-semibold">
              {formatTime(stats.timeSpent || 0)}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Pages Read</span>
            </div>
            <p className="text-lg font-semibold">
              {stats.lastPage} / {stats.totalPages}
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-sm text-gray-500">
            Last read: {new Date(stats.lastRead || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}