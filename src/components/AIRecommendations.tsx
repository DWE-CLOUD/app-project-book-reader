import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BookOpen, Sparkles } from 'lucide-react';

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (bookTitle: string) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
      <h2 className="flex items-center text-lg font-semibold mb-4">
        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
        AI Recommendations
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}