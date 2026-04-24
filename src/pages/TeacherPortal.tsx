import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Save, CheckCircle2, User, ArrowRight, Sparkles, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';

const DUMMY_STUDENTS = [
  { id: '1', name: 'علی خان', roll: '101' },
  { id: '2', name: 'احمد رضا', roll: '102' },
  { id: '3', name: 'فاطمہ زہرا', roll: '103' },
  { id: '4', name: 'عمر فاروق', roll: '104' },
  { id: '5', name: 'زینب بی بی', roll: '105' },
];

const TeacherPortal = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [markAll, setMarkAll] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    DUMMY_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {})
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [results, setResults] = useState<{ name: string, marks: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'ur' ? 'ur-PK' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        
        const words = currentTranscript.split(' ');
        if (words.length >= 2) {
          const marks = words.find(w => !isNaN(Number(w)));
          const name = words.find(w => isNaN(Number(w)));
          if (name && marks) {
            setResults(prev => [...prev, { name, marks }]);
            setTranscript('');
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleToggleAll = (val: boolean) => {
    setMarkAll(val);
    const newAttendance = { ...attendance };
    DUMMY_STUDENTS.forEach(s => {
      newAttendance[s.id] = val;
    });
    setAttendance(newAttendance);
  };

  const toggleStudent = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const present = Object.keys(attendance).filter(id => attendance[id]);
      const absent = Object.keys(attendance).filter(id => !attendance[id]);
      
      await addDoc(collection(db, 'Student_Attendance'), {
        school_id: 'school_123',
        class_id: 'class_123',
        date: new Date().toISOString().split('T')[0],
        present_array: present,
        absent_array: absent,
        marked_by: 'Teacher 1',
      });
      alert(t('success'));
    } catch (error) {
      console.error(error);
      alert(t('error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="glass sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-600">
            <ArrowRight size={24} className={language === 'ur' ? '' : 'rotate-180'} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">{t('teacher')}</h1>
        </div>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Globe size={20} />
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Smart Attendance Section */}
        <section className="glass p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              {t('studentAttendance')}
            </h2>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <span className="text-xs font-medium px-2">{t('markAllPresent')}</span>
              <button 
                onClick={() => handleToggleAll(!markAll)}
                className={`w-12 h-6 rounded-full transition-colors relative ${markAll ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${markAll ? (language === 'ur' ? 'right-7' : 'left-7') : (language === 'ur' ? 'right-1' : 'left-1')}`}></div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {DUMMY_STUDENTS.map(student => (
              <div 
                key={student.id}
                onClick={() => toggleStudent(student.id)}
                className={`p-4 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                  attendance[student.id] 
                    ? 'bg-indigo-50/50 border-indigo-100' 
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${attendance[student.id] ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{t('rollNumber')}: {student.roll}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  attendance[student.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {attendance[student.id] && <CheckCircle2 size={16} />}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={saveAttendance}
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {t('save')}
          </button>
        </section>

        {/* Voice Result Entry Section */}
        <section className="glass p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2">
            <Mic className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">{t('voiceResult')}</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden">
            {isListening && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-indigo-600/20"
              />
            )}
            
            <button 
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all z-10 ${
                isListening ? 'bg-red-500 shadow-lg shadow-red-900/50' : 'bg-indigo-600 shadow-lg shadow-indigo-900/50'
              }`}
            >
              {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
            </button>
            
            <div className="z-10">
              <p className="text-white font-medium">
                {isListening ? t('listening') : t('speakNow')}
              </p>
            </div>
          </div>

          {transcript && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-900 italic">"{transcript}"</p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 px-1">{language === 'en' ? "Result Preview" : "رزلٹ کا پیش نظارہ"}</h3>
            <div className="space-y-2">
              {results.length === 0 ? (
                <p className="text-center py-4 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-2xl">
                  {language === 'en' ? "No data yet" : "کوئی ڈیٹا نہیں"}
                </p>
              ) : (
                results.map((res, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100"
                  >
                    <span className="font-medium">{res.name}</span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold">{res.marks}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeacherPortal;
