import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSearchQuery, isDarkMode } = useBookStore();

  return (
    <div className={`relative ${isExpanded ? 'w-64' : 'w-10'} transition-all duration-200`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search in document..."
          className={`w-full h-10 pl-10 pr-4 rounded-full outline-none transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-100 text-gray-800 placeholder-gray-500'
          } ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={(e) => {
            if (!e.target.value) setIsExpanded(false);
          }}
        />
        <Search
          className={`absolute left-3 top-2.5 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } cursor-pointer`}
          onClick={() => setIsExpanded(true)}
        />
      </div>
    </div>
  );
}