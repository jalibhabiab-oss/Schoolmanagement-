import React from 'react';
import { Sparkles, ArrowRight, Globe, Shield, Zap, BarChart3, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-xl text-slate-900">{t('appName')}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <Globe size={16} />
            {language === 'en' ? 'اردو' : 'English'}
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            {t('login')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold"
          >
            <Sparkles size={16} />
            {t('tagline')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-tight"
          >
            {language === 'en' ? (
              <>Empower Your School with <span className="text-indigo-600">AI Intelligence</span></>
            ) : (
              <>اپنے سکول کو <span className="text-indigo-600">اے آئی</span> سے بااختیار بنائیں</>
            )}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {language === 'en' 
              ? "The all-in-one platform for attendance, results, and smart insights. Designed for the modern Asian educational landscape."
              : "حاضری، رزلٹ اور سمارٹ بصیرت کے لیے آل ان ون پلیٹ فارم۔ جدید ایشیائی تعلیمی منظر نامے کے لیے ڈیزائن کیا گیا ہے۔"}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              {t('bookDemo')}
              <ArrowRight size={20} className={language === 'ur' ? 'rotate-180' : ''} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              {t('login')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">{language === 'en' ? "Smart Attendance" : "سمارٹ حاضری"}</h3>
            <p className="text-slate-500 text-sm">
              {language === 'en' 
                ? "One-tap attendance for students and staff with real-time notifications."
                : "طلباء اور عملے کے لیے ایک ٹیپ حاضری اور فوری اطلاعات۔"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold">{language === 'en' ? "AI Insights" : "اے آئی بصیرت"}</h3>
            <p className="text-slate-500 text-sm">
              {language === 'en' 
                ? "Predictive analytics to identify dropping attendance or pending fees."
                : "گرتی ہوئی حاضری یا واجب الادا فیسوں کی نشاندہی کے لیے جدید تجزیات۔"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">{language === 'en' ? "Multi-Tenant Secure" : "محفوظ اور ملٹی ٹیننٹ"}</h3>
            <p className="text-slate-500 text-sm">
              {language === 'en' 
                ? "Each school gets its own isolated, secure database and dashboard."
                : "ہر سکول کو اپنا الگ، محفوظ ڈیٹا بیس اور ڈیش بورڈ ملتا ہے۔"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
