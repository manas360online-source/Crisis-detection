
import React, { useState } from 'react';
import { AssessmentData } from '../types';

interface SimulationPanelProps {
  onAnalyze: (data: AssessmentData) => void;
  isLoading: boolean;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<AssessmentData>({
    phq9Score: 10,
    gad7Score: 8,
    phq9Q9Response: 0,
    textResponse: "I've been feeling a bit stressed lately.",
    previousScore: 8,
    lastContactDays: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Patient Data Simulation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PHQ-9 Total Score (0-27)</label>
            <input 
              type="number" min="0" max="27"
              value={formData.phq9Score}
              onChange={e => setFormData({...formData, phq9Score: Number(e.target.value)})}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GAD-7 Total Score (0-21)</label>
            <input 
              type="number" min="0" max="21"
              value={formData.gad7Score}
              onChange={e => setFormData({...formData, gad7Score: Number(e.target.value)})}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Q9 (Self-harm/Suicide) (0-3)</label>
            <input 
              type="number" min="0" max="3"
              value={formData.phq9Q9Response}
              onChange={e => setFormData({...formData, phq9Q9Response: Number(e.target.value)})}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Previous PHQ-9 Score</label>
            <input 
              type="number" min="0" max="27"
              value={formData.previousScore}
              onChange={e => setFormData({...formData, previousScore: Number(e.target.value)})}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Note / Chat Message</label>
          <textarea 
            rows={3}
            value={formData.textResponse}
            onChange={e => setFormData({...formData, textResponse: e.target.value})}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe thoughts/feelings for ML analysis..."
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
          }`}
        >
          {isLoading ? 'Analyzing Risk...' : 'Process Crisis Detection'}
        </button>
      </form>
    </div>
  );
};

export default SimulationPanel;
