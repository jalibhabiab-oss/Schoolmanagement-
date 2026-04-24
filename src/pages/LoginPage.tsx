import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { Sparkles, Lock, User, Loader2, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [role, setRole] = useState<'principal' | 'teacher'>('principal');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulated login logic
    setTimeout(() => {
      if (role === 'principal') {
        navigate('/dashboard');
      } else {
        navigate('/teacher');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">{t('appName')}</h1>
          <p className="text-slate-500 font-medium">{t('login')}</p>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => setRole('principal')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'principal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t('principal')}
            </button>
            <button 
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'teacher' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t('teacher')}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 px-1">
                {role === 'principal' ? (language === 'en' ? 'Email / Username' : 'ای میل / یوزر نیم') : (language === 'en' ? 'Teacher ID' : 'ٹیچر آئی ڈی')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder={role === 'principal' ? "admin@school.com" : "T-101"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 px-1">
                {language === 'en' ? 'PIN / Password' : 'پن / پاس ورڈ'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : t('login')}
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Globe size={16} />
            {language === 'en' ? 'اردو' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
