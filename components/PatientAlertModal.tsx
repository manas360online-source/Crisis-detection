
import React from 'react';
import { RiskLevel } from '../types';

interface PatientAlertModalProps {
  level: RiskLevel;
  onClose: () => void;
}

const PatientAlertModal: React.FC<PatientAlertModalProps> = ({ level, onClose }) => {
  if (level !== RiskLevel.HIGH && level !== RiskLevel.CRITICAL) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-[#e11d48] p-10 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-6">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-2">Help is Available</h2>
          <p className="text-rose-100 text-sm opacity-90 leading-relaxed px-4">
            We've detected that you might be going through a difficult time. Please reach out for support.
          </p>
        </div>
        
        <div className="p-8 bg-white space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">📞</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">National Crisis Line</h3>
                <p className="text-xs text-gray-500">Call or text 988 for immediate help (24/7)</p>
                <a href="tel:988" className="text-[#e11d48] text-sm font-bold mt-1 inline-block border-b-2 border-rose-200">Call 988 Now</a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">💬</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">Crisis Text Line</h3>
                <p className="text-xs text-gray-500">Text HOME to 741741 to connect with a Counselor</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
             <button 
              className="flex-1 bg-[#e11d48] text-white py-4 rounded-2xl font-black text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              onClick={() => window.location.href = 'tel:911'}
            >
              Call Emergency (911)
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              I'm OK, close this
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
            Your therapist has been notified and will reach out to you shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAlertModal;
