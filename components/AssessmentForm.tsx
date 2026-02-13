
import React, { useState } from 'react';
import { PHQ9Response } from '../types';

interface AssessmentFormProps {
  onSubmit: (responses: PHQ9Response) => void;
  isLoading: boolean;
}

const questions = [
  { id: 'q1', text: 'Little interest or pleasure in doing things' },
  { id: 'q2', text: 'Feeling down, depressed, or hopeless' },
  { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 'q4', text: 'Feeling tired or having little energy' },
  { id: 'q5', text: 'Poor appetite or overeating' },
  { id: 'q6', text: 'Feeling bad about yourself — or that you are a failure' },
  { id: 'q7', text: 'Trouble concentrating on things' },
  { id: 'q8', text: 'Moving/speaking slowly or being restless' },
  { id: 'q9', text: 'Thoughts of hurting yourself or that you\'d be better off dead' },
];

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [responses, setResponses] = useState<PHQ9Response>({
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0
  });

  const handleSelect = (qId: keyof PHQ9Response, val: number) => {
    setResponses(prev => ({ ...prev, [qId]: val }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-indigo-600">📋</span> PHQ-9 Mental Health Assessment
        </h2>
        <p className="text-gray-500 mt-2 italic">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              <span className="text-indigo-600 font-bold mr-2">{idx + 1}.</span> {q.text}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.id as keyof PHQ9Response, opt.value)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    responses[q.id as keyof PHQ9Response] === opt.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-[1.02]'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <button
          onClick={() => onSubmit(responses)}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100'
          }`}
        >
          {isLoading ? 'Processing Assessment...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
};

export default AssessmentForm;
