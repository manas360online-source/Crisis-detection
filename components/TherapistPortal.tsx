
import React, { useState } from 'react';
import { PatientRecord, RiskLevel } from '../types';
import AnalysisDisplay from './AnalysisDisplay';

interface TherapistPortalProps {
  patients: PatientRecord[];
}

const TherapistPortal: React.FC<TherapistPortalProps> = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const immediateCases = patients.filter(p => p.latestAnalysis?.level === RiskLevel.CRITICAL || p.latestAnalysis?.level === RiskLevel.HIGH);
  const standardCases = patients.filter(p => p.latestAnalysis?.level === RiskLevel.MEDIUM || p.latestAnalysis?.level === RiskLevel.LOW || !p.latestAnalysis);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Platform Sentiment" value="42.5" trend="5.2%" />
            <MetricCard label="Active Surveillance" value="128" sub="Assigned Cases" />
            <MetricCard label="Detection Precision" value="92.4%" tag="Gemini AI" />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-lg font-black text-slate-800 tracking-tight">Clinical Assessments Repository</h2>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total: {patients.length} Records</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full blinking"></span>
                    <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Immediate Attention</h3>
                  </div>
                  <div className="space-y-4">
                    {immediateCases.map(p => (
                      <AssessmentCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6 border-l border-slate-50 pl-12">
                   <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Monitoring</h3>
                  </div>
                  <div className="space-y-4">
                    {standardCases.map(p => (
                      <AssessmentCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="w-[420px] bg-[#1a1d23] text-white flex flex-col p-6 overflow-y-auto">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black flex items-center gap-2">❤️ Emergency Triage</h2>
            <span className="bg-rose-600/20 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded-lg border border-rose-600/30">LIVE</span>
         </div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Monitoring {immediateCases.length} Pending Cases</p>
         
         <div className="space-y-4">
            {immediateCases.map(p => (
              <TriageCase key={p.id} patient={p} />
            ))}
         </div>
      </div>

      {selectedPatient?.latestAnalysis && (
        <AnalysisDisplay 
          analysis={selectedPatient.latestAnalysis} 
          responses={selectedPatient.assessments[0].responses}
          dailyLog={selectedPatient.assessments[0].dailyLog}
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          patientAge={selectedPatient.age}
          patientDob={selectedPatient.dob}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

const MetricCard = ({ label, value, trend, sub, tag }: any) => (
  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{label}</span>
    <div className="flex items-center justify-between">
       <span className="text-3xl font-black text-slate-800">{value}</span>
       {trend && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-lg">{trend}</span>}
       {sub && <span className="text-[10px] font-bold text-slate-400">{sub}</span>}
       {tag && <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-full">{tag}</span>}
    </div>
  </div>
);

// fix: use React.FC to properly handle React's internal props like 'key'
const AssessmentCard: React.FC<{ patient: PatientRecord; onClick: () => void }> = ({ patient, onClick }) => {
  const analysis = patient.latestAnalysis;
  const isCritical = analysis?.level === RiskLevel.CRITICAL || analysis?.level === RiskLevel.HIGH;

  return (
    <div onClick={onClick} className={`p-6 rounded-[20px] border transition-all hover:shadow-md cursor-pointer ${isCritical ? 'bg-rose-50/30 border-rose-100 critical-glow' : 'bg-white border-slate-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PATIENT #{patient.id.toUpperCase()}</span>
           <h4 className="text-sm font-bold text-slate-700">{patient.name}</h4>
           <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">AGE: {patient.age || 'N/A'}</p>
        </div>
        {analysis && (
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
            analysis.level === RiskLevel.CRITICAL ? 'bg-rose-600 text-white blinking' : 'bg-green-500 text-white'
          }`}>
            {analysis.level}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-[8px] font-black text-slate-300 uppercase block">PHQ-9 Score</span>
          <span className="text-xl font-black text-slate-800">{patient.assessments[0]?.phq9Score || 0}</span>
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-300 uppercase block">Stress Lvl</span>
          <span className="text-xl font-black text-slate-800">{patient.assessments[0]?.dailyLog?.stressIntensity || 0}/5</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <span className="text-[10px] font-medium text-slate-400">{new Date(patient.assessments[0]?.timestamp || Date.now()).toLocaleDateString()}</span>
        <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">View Full Details</button>
      </div>
    </div>
  );
};

// fix: use React.FC to properly handle React's internal props like 'key'
const TriageCase: React.FC<{ patient: PatientRecord }> = ({ patient }) => (
  <div className="bg-[#242931] rounded-[24px] border border-rose-900/20 p-5">
     <div className="flex justify-between items-center mb-4">
        <span className="bg-rose-600/20 text-rose-500 text-[8px] font-black px-2 py-0.5 rounded-lg border border-rose-600/30 uppercase tracking-widest">Critical Urgency</span>
        <span className="text-[10px] font-medium text-slate-500">12:22 PM</span>
     </div>

     <div className="flex items-center gap-3 mb-4">
       <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-bold uppercase">{patient.name.slice(0,2)}</div>
       <div>
         <h4 className="text-sm font-bold text-slate-200">{patient.name}</h4>
         <p className="text-[9px] font-medium text-rose-500">Stress: {patient.assessments[0]?.dailyLog?.stressIntensity}/5 • Energy: {patient.assessments[0]?.dailyLog?.energyLevel}/5</p>
       </div>
     </div>

     <button className="w-full py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20">
       Intercept Now
     </button>
  </div>
);

export default TherapistPortal;
