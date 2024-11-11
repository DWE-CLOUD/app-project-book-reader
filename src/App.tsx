import React from 'react';
import Sidebar from './components/Sidebar';
import BookReader from './components/BookReader';
import AIRecommendations from './components/AIRecommendations';
import { useBookStore } from './store/bookStore';

function App() {
  const { isDarkMode } = useBookStore();

  return (
    <div
      className={`flex min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <BookReader />
        <AIRecommendations />
      </div>
    </div>
  );
}
