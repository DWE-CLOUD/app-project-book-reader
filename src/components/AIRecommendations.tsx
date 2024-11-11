import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BookOpen, Sparkles, Key } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const { geminiApiKey, setGeminiApiKey, isDarkMode } = useBookStore();

  const getRecommendations = async (bookTitle: string) => {
    if (!geminiApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `Suggest 5 similar books to "${bookTitle}" with brief descriptions. Format as JSON array with title and description fields.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsed = JSON.parse(text);
      setRecommendations(parsed);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(tempApiKey);
    setShowApiKeyInput(false);
    setTempApiKey('');
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-4 mt-4`}>
      <h2 className="flex items-center text-lg font-semibold mb-4">
        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
        AI Recommendations
      </h2>
      
      {!geminiApiKey && (
        <button
          onClick={() => setShowApiKeyInput(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
        >
          <Key className="w-4 h-4 mr-2" />
          Configure Gemini API Key
        </button>
      )}

      {showApiKeyInput && (
        <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className={`w-full px-3 py-2 rounded-lg mb-2 ${
              isDarkMode ? 'bg-gray-600 text-white' : 'bg-white'
            }`}
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save API Key
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}