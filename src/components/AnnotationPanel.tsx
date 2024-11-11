import React, { useState } from 'react';
import { useBookStore } from '../store/bookStore';
import { PenTool, Trash2 } from 'lucide-react';

interface AnnotationPanelProps {
  pageNumber: number;
}

export default function AnnotationPanel({ pageNumber }: AnnotationPanelProps) {
  const [newAnnotation, setNewAnnotation] = useState('');
  const { currentBook, annotations, addAnnotation, isDarkMode } = useBookStore();

  const handleAddAnnotation = () => {
    if (!currentBook || !newAnnotation.trim()) return;

    addAnnotation(currentBook, {
      page: pageNumber,
      text: newAnnotation,
      color: '#3B82F6',
      timestamp: Date.now(),
    });
    setNewAnnotation('');
  };

  const currentAnnotations = currentBook
    ? annotations[currentBook]?.filter((a) => a.page === pageNumber) || []
    : [];

  return (
    <div className={`w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <PenTool className="w-5 h-5 mr-2" />
        Annotations
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Add a note..."
            className={`flex-1 px-3 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-800 placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleAddAnnotation}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {currentAnnotations.map((annotation, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                {annotation.text}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(annotation.timestamp).toLocaleString()}
                </span>
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}