
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello. I am your Wellness Assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are a compassionate mental health support assistant. Your goal is to provide a safe space for patients to talk. Be empathetic, non-judgmental, and validating. If you detect immediate self-harm or crisis, encourage them to call a lifeline, but do not be clinical. Be human-like.'
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'I am here to listen.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am sorry, I had trouble connecting. I am still here if you want to keep talking.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] max-w-4xl mx-auto overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white">
        <h3 className="font-bold">AI Wellness Companion</h3>
        <p className="text-xs opacity-80">Confidential Support Chat</p>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none italic text-gray-400 text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Share what's on your mind..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button 
          onClick={handleSend}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
