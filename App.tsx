
import React, { useState, useCallback } from 'react';
import { PortalType, PHQ9Response, DailyLogData, AssessmentData, RiskLevel, PatientRecord, RiskAnalysis } from './types';
import { calculateTotalScore, calculateRisk } from './services/crisisEngine';
import { analyzeCrisisSentiment } from './services/geminiService';
import PatientPortal from './components/PatientPortal';
import TherapistPortal from './components/TherapistPortal';
import PatientAlertModal from './components/PatientAlertModal';

const App: React.FC = () => {
  const [portal, setPortal] = useState<PortalType>(PortalType.HOME);
  const [loading, setLoading] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<RiskAnalysis | null>(null);
  const [registrationRequired, setRegistrationRequired] = useState(true);
  
  const [patients, setPatients] = useState<PatientRecord[]>([
    { 
      id: 'p-5481', 
      name: 'John Smith', 
      age: '34',
      dob: '12/04/1990',
      assessments: [{
        responses: { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2, q6: 2, q7: 2, q8: 1, q9: 1 },
        dailyLog: { hoursOfSleep: 4, sleepQuality: 1, energyLevel: 2, stressIntensity: 5 },
        phq9Score: 21,
        gad7Score: 0,
        textResponse: "I am feeling very hopeless.",
        lastContactDays: 2,
        timestamp: new Date().toISOString()
      }],
      latestAnalysis: {
        score: 75,
        level: RiskLevel.CRITICAL,
        indicators: ["PHQ-9 > 20", "Q9 > 0"],
        sentimentScore: 80,
        behaviorScore: 40,
        timestamp: new Date().toISOString()
      }
    }
  ]);

  const [currentPatient, setCurrentPatient] = useState<PatientRecord | null>(null);

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const dob = formData.get('dob') as string;

    const newPatient: PatientRecord = {
      id: `p-${Math.random().toString(36).substr(2, 4)}`,
      name,
      age,
      dob,
      assessments: []
    };
    
    setCurrentPatient(newPatient);
    setPatients(prev => [newPatient, ...prev]);
    setRegistrationRequired(false);
  };

  const handleAssessmentSubmit = async (responses: PHQ9Response, dailyLog: DailyLogData) => {
    setLoading(true);
    const score = calculateTotalScore(responses);
    
    const assessment: AssessmentData = {
      responses,
      dailyLog,
      phq9Score: score,
      gad7Score: 0,
      textResponse: "Assessment submission.",
      previousScore: currentPatient?.assessments[0]?.phq9Score,
      lastContactDays: 0,
      timestamp: new Date().toISOString()
    };

    try {
      const sentiment = await analyzeCrisisSentiment("Context check.");
      const analysis = calculateRisk(assessment, sentiment.score);
      
      setPatients(prev => prev.map(p => p.id === currentPatient?.id ? {
        ...p,
        assessments: [assessment, ...p.assessments],
        latestAnalysis: analysis
      } : p));

      if (currentPatient) {
        setCurrentPatient({...currentPatient, assessments: [assessment, ...currentPatient.assessments], latestAnalysis: analysis});
      }

      setActiveAnalysis(analysis);
      if (analysis.level === RiskLevel.HIGH || analysis.level === RiskLevel.CRITICAL) {
        setShowCrisisModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (portal === PortalType.HOME) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <header className="text-center mb-16">
             <div className="w-16 h-16 bg-[#e11d48] rounded-[24px] mx-auto flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-rose-100">M</div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Manas360</h1>
             <p className="text-slate-500 font-medium">Mental Wellness Platform</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => setPortal(PortalType.PATIENT)} className="bg-white p-10 rounded-[36px] border border-slate-100 hover:border-rose-500 hover:shadow-2xl transition-all text-left group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">👤</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient Portal</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">Access clinical assessments, wellness tracking, and support chat.</p>
              <span className="text-rose-600 font-bold flex items-center gap-2">Enter Portal <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </button>

            <button onClick={() => setPortal(PortalType.THERAPIST)} className="bg-white p-10 rounded-[36px] border border-slate-100 hover:border-rose-500 hover:shadow-2xl transition-all text-left group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🩺</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Clinical Dashboard</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">Real-time surveillance dashboard with automated triage and demographics.</p>
              <span className="text-rose-600 font-bold flex items-center gap-2">Launch Platform <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <button onClick={() => setPortal(PortalType.HOME)} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#e11d48] rounded-xl flex items-center justify-center text-white text-[10px] font-black">M</div>
            <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">Manas360</span>
          </button>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
              {portal.toUpperCase()} SESSION ACTIVE
            </span>
            <button onClick={() => {setPortal(PortalType.HOME); setRegistrationRequired(true);}} className="text-slate-400 hover:text-rose-600 text-sm font-bold transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {portal === PortalType.PATIENT && (
        registrationRequired ? (
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[40px] shadow-sm max-w-lg w-full">
               <h2 className="text-3xl font-serif text-slate-800 mb-8">Patient Registration</h2>
               <form onSubmit={handleRegistration} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                   <input required name="name" type="text" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sanky" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Age</label>
                     <input required name="age" type="number" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="25" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">DOB</label>
                     <input required name="dob" type="date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                 </div>
                 <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all">Start Wellness Session</button>
               </form>
            </div>
          </div>
        ) : currentPatient && (
          <PatientPortal patient={currentPatient} onAssessmentSubmit={handleAssessmentSubmit} isLoading={loading} />
        )
      )}
      
      {portal === PortalType.THERAPIST && <TherapistPortal patients={patients} />}

      {showCrisisModal && activeAnalysis && (
        <PatientAlertModal level={activeAnalysis.level} onClose={() => setShowCrisisModal(false)} />
      )}
    </div>
  );
};

export default App;
