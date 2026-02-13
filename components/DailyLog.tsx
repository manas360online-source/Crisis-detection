
import React, { useState } from 'react';
import { DailyLogData } from '../types';

interface DailyLogProps {
  patientName: string;
  onContinue: (data: DailyLogData) => void;
}

const DailyLog: React.FC<DailyLogProps> = ({ patientName, onContinue }) => {
  const [data, setData] = useState<DailyLogData>({
    hoursOfSleep: 7,
    sleepQuality: 2,
    energyLevel: 1,
    stressIntensity: 2
  });

  const ScaleSelector = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h4>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-12 h-10 rounded-xl font-bold transition-all ${
              value === num 
                ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-200 scale-105' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#f0f4f8] min-h-[600px] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] shadow-sm max-w-4xl w-full p-16">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-serif text-slate-800 mb-2">Wellness Center</h1>
            <p className="text-[#2563eb] text-xs font-black uppercase tracking-widest">Active: {patientName.toUpperCase()} (10223)</p>
          </div>
          <div className="flex bg-[#f1f5f9] p-1 rounded-full">
            <button className="bg-[#2563eb] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Daily Log</button>
            <button className="text-slate-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">AI Support</button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif text-slate-800">Let's start with you, {patientName}</h2>
          <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-widest">Step 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 mb-16">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours of Sleep</h4>
            <div className="relative pt-6 px-2">
              <input 
                type="range" min="0" max="12" step="1" 
                value={data.hoursOfSleep}
                onChange={e => setData({...data, hoursOfSleep: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <div className="flex justify-between mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">0 hrs</span>
                <span className="text-sm font-black text-[#2563eb]">{data.hoursOfSleep} HRS</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">12+ hrs</span>
              </div>
            </div>
          </div>

          <ScaleSelector label="Energy Level" value={data.energyLevel} onChange={v => setData({...data, energyLevel: v})} />
          <ScaleSelector label="Sleep Quality" value={data.sleepQuality} onChange={v => setData({...data, sleepQuality: v})} />
          <ScaleSelector label="Stress Intensity" value={data.stressIntensity} onChange={v => setData({...data, stressIntensity: v})} />
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => onContinue(data)}
            className="bg-[#2563eb] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Continue <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
