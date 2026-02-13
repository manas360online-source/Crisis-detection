
import React, { useState } from 'react';
import AssessmentForm from './AssessmentForm';
import SupportChat from './SupportChat';
import DailyLog from './DailyLog';
import { PHQ9Response, DailyLogData, PatientRecord } from '../types';

interface PatientPortalProps {
  patient: PatientRecord;
  onAssessmentSubmit: (responses: PHQ9Response, dailyLog: DailyLogData) => void;
  isLoading: boolean;
}

const PatientPortal: React.FC<PatientPortalProps> = ({ patient, onAssessmentSubmit, isLoading }) => {
  const [step, setStep] = useState<'log' | 'assessment' | 'chat' | 'progress'>('log');
  const [currentDailyLog, setCurrentDailyLog] = useState<DailyLogData | null>(null);

  const handleLogContinue = (data: DailyLogData) => {
    setCurrentDailyLog(data);
    setStep('assessment');
  };

  const handleAssessmentFinish = (responses: PHQ9Response) => {
    if (currentDailyLog) {
      onAssessmentSubmit(responses, currentDailyLog);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Dynamic Header based on step */}
      {step !== 'log' && (
        <div className="max-w-7xl mx-auto px-8 pt-8">
           <header className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Patient Wellness Center</h1>
            <p className="text-slate-500 font-medium">Monitoring wellness for {patient.name}</p>
          </header>

          <div className="flex gap-4 mb-8 border-b border-slate-100">
            {['assessment', 'chat', 'progress'].map(tab => (
              <button 
                key={tab}
                onClick={() => setStep(tab as any)}
                className={`pb-4 px-6 text-xs font-black uppercase tracking-widest transition-all ${
                  step === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'assessment' ? '📋 Daily Check-in' : tab === 'chat' ? '💬 AI Support Chat' : '📈 Progress Tracking'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="animate-in fade-in duration-500">
        {step === 'log' && (
          <DailyLog patientName={patient.name} onContinue={handleLogContinue} />
        )}

        {step === 'assessment' && (
          <div className="py-8 px-4">
             <AssessmentForm onSubmit={handleAssessmentFinish} isLoading={isLoading} />
          </div>
        )}

        {step === 'chat' && (
          <div className="py-8 px-4">
            <SupportChat />
          </div>
        )}

        {step === 'progress' && (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <ProgressView patient={patient} />
          </div>
        )}
      </div>
    </div>
  );
};

const ProgressView: React.FC<{ patient: PatientRecord }> = ({ patient }) => (
  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 space-y-8">
    <h2 className="text-xl font-black text-slate-900 tracking-tighter">Clinical Outcome & Progress</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHQ-9 History</h3>
        <div className="space-y-3">
          {patient.assessments.map((a, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">{new Date(a.timestamp).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-indigo-600">{a.phq9Score}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase">SCORE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wellness Trends</h3>
        <div className="p-6 bg-indigo-600 rounded-3xl text-white">
          <p className="text-xs opacity-80 mb-4">Latest Wellness Averages</p>
          {patient.assessments[0]?.dailyLog ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">Energy Level</span>
                <span className="text-xl font-black">{patient.assessments[0].dailyLog.energyLevel}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">Stress Intensity</span>
                <span className="text-xl font-black">{patient.assessments[0].dailyLog.stressIntensity}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">Sleep Quality</span>
                <span className="text-xl font-black">{patient.assessments[0].dailyLog.sleepQuality}/5</span>
              </div>
            </div>
          ) : (
             <p className="text-sm">Complete your daily log to see trends.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default PatientPortal;
