import React from 'react';
import Sidebar from './components/Sidebar';
import BookReader from './components/BookReader';
import AIRecommendations from './components/AIRecommendations';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <BookReader />
        <AIRecommendations />
      </div>
    </div>
  );
}

export default App;