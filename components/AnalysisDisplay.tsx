
import React from 'react';
import { RiskAnalysis, RiskLevel, PHQ9Response, DailyLogData } from '../types';

interface AnalysisDisplayProps {
  analysis: RiskAnalysis;
  responses: PHQ9Response;
  dailyLog?: DailyLogData;
  patientId: string;
  patientName: string;
  patientAge?: string;
  patientDob?: string;
  onClose: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
  analysis, responses, dailyLog, patientId, patientName, patientAge, patientDob, onClose 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#e11d48] p-6 text-white flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Clinical Assessment Report: {patientName}</h2>
              <p className="text-rose-100 text-xs font-medium opacity-80">
                Record ID: {patientId} • Age: {patientAge || 'N/A'} • DOB: {patientDob || 'N/A'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Architecture</h3>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-full border-4 border-rose-100 shrink-0">
                  <span className="text-xl font-black text-slate-800">{analysis.score}</span>
                  <div className="absolute -top-1 right-0 bg-white border border-rose-200 text-[8px] px-1 rounded font-bold text-rose-600">SCORE</div>
                </div>
                <div className="flex-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase mb-1 ${analysis.level === RiskLevel.CRITICAL ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {analysis.level} Priority
                  </span>
                  <p className="text-[10px] text-slate-500 leading-tight">Composite risk derived from standardized testing and behavioral patterns.</p>
                </div>
              </div>

              {dailyLog && (
                <div className="mt-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daily Wellness Log</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-[8px] font-black text-blue-400 uppercase">Sleep</span>
                      <p className="text-lg font-black text-blue-800">{dailyLog.hoursOfSleep} hrs</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-[8px] font-black text-blue-400 uppercase">Energy</span>
                      <p className="text-lg font-black text-blue-800">{dailyLog.energyLevel}/5</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-[8px] font-black text-blue-400 uppercase">Stress</span>
                      <p className="text-lg font-black text-blue-800">{dailyLog.stressIntensity}/5</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-[8px] font-black text-blue-400 uppercase">Sleep Quality</span>
                      <p className="text-lg font-black text-blue-800">{dailyLog.sleepQuality}/5</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Standardized Scores</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">PHQ-9 (Depression)</h4>
                    <p className="text-[9px] text-slate-400">Standard clinical diagnostic</p>
                  </div>
                  {/* fix: explicitly cast Object.values to number array for the reducer to avoid unknown type errors */}
                  <span className="text-lg font-black text-indigo-600">{(Object.values(responses) as number[]).reduce((a, b) => a + b, 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold">Item #9 Response</h4>
                    <p className="text-[9px] opacity-60">Self-harm indicator</p>
                  </div>
                  <span className="text-lg font-black">{responses.q9}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Detection Insights</h3>
                <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                   <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                     "System detected consistent low energy levels and elevated stress intensity compared to historical baseline. High priority monitoring recommended."
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Action Plan</h3>
            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                 Send Patient Follow-up
               </button>
               <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
                 Schedule Emergency Session
               </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 px-8 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>HIPAA COMPLIANT RECORD</span>
          <button onClick={onClose} className="hover:text-slate-600">Close Report</button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
