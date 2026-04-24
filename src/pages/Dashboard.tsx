import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, Wallet, Bell, MessageSquare, Plus, FileText, Sparkles, Trash2, BarChart3, Globe, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [classes, setClasses] = useState<{id: string, class_name: string}[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'snapshot' | 'classes' | 'reports' | 'staff'>('snapshot');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const q = query(collection(db, 'Classes'), where('school_id', '==', 'school_123'));
    const querySnapshot = await getDocs(q);
    const classesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    setClasses(classesList);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'Classes'), {
        school_id: 'school_123',
        class_name: newClassName,
        created_at: new Date(),
      });
      setNewClassName('');
      fetchClasses();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure?' : 'کیا آپ واقعی ختم کرنا چاہتے ہیں؟')) return;
    await deleteDoc(doc(db, 'Classes', id));
    fetchClasses();
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Top Nav */}
      <nav className="glass sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <Sparkles size={24} />
          </div>
          <h1 className="text-xl font-bold text-indigo-900">{t('appName')}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Globe size={20} />
          </button>
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'snapshot', label: t('todaySnapshot'), icon: Sparkles },
          { id: 'classes', label: t('classes'), icon: Users },
          { id: 'reports', label: t('reports'), icon: BarChart3 },
          { id: 'staff', label: t('staffAttendance'), icon: CalendarCheck },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="p-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'snapshot' && (
            <motion.div 
              key="snapshot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-3xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Users size={24} /></div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{t('totalStudents')}</p>
                    <h3 className="text-3xl font-bold">1,240</h3>
                  </div>
                </div>

                <div className="glass p-5 rounded-3xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><CalendarCheck size={24} /></div>
                    <span className="text-xs font-medium text-slate-500">94%</span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{t('studentAttendance')}</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-orange-500 h-full w-[94%]"></div>
                    </div>
                  </div>
                </div>

                <div className="glass p-5 rounded-3xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Wallet size={24} /></div>
                    <span className="text-xs font-medium text-emerald-600">65%</span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{t('fees')}</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[65%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Alerts */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-800">{t('aiAlerts')}</h3>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl mt-1"><MessageSquare size={18} /></div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-amber-900 leading-relaxed">
                      {language === 'en' 
                        ? "⚠️ 12 students in Class 8 have pending fees. Send auto-reminders?" 
                        : "⚠️ کلاس 8 کے 12 طلباء کی فیس واجب الادا ہے۔ کیا آپ یاد دہانی بھیجنا چاہتے ہیں؟"}
                    </p>
                    <button className="text-xs font-bold text-amber-700 bg-amber-200/50 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
                      {language === 'en' ? "Send Auto WhatsApp" : "خودکار واٹس ایپ بھیجیں"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="space-y-3">
                <h3 className="font-bold text-slate-800 px-1">{t('quickActions')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/add-student')} className="glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-indigo-50 transition-colors group">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                    <span className="text-sm font-medium">{t('addStudent')}</span>
                  </button>
                  <button className="glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-indigo-50 transition-colors group">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform"><Wallet size={24} /></div>
                    <span className="text-sm font-medium">{t('addFee')}</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div 
              key="classes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-800">{t('addClass')}</h3>
                <form onSubmit={handleAddClass} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder={language === 'en' ? "e.g. Class 8-A" : "مثلاً: کلاس 8-A"}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                  <button 
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                  >
                    {t('save')}
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 px-1">{t('classes')}</h3>
                {classes.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">{language === 'en' ? "No classes added yet." : "ابھی تک کوئی کلاس شامل نہیں کی گئی۔"}</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {classes.map(cls => (
                      <div key={cls.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={18} /></div>
                          <span className="font-bold text-slate-800">{cls.class_name}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteClass(cls.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <button className="glass p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-indigo-50 transition-colors">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl"><CalendarCheck size={32} /></div>
                  <span className="font-bold">{t('monthly')} {t('reports')}</span>
                </button>
                <button className="glass p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-indigo-50 transition-colors">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl"><BarChart3 size={32} /></div>
                  <span className="font-bold">{t('yearly')} {t('reports')}</span>
                </button>
              </div>

              <div className="glass p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-800">{language === 'en' ? "Class-wise Registers" : "کلاس وار رجسٹر"}</h3>
                <div className="space-y-2">
                  {classes.map(cls => (
                    <button key={cls.id} className="w-full flex justify-between items-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <span className="font-medium">{cls.class_name}</span>
                      <FileText size={18} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div 
              key="staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">{t('staffAttendance')}</h3>
                  <div className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</div>
                </div>
                
                <div className="space-y-3">
                  {['ٹیچر علی', 'ٹیچر سارہ', 'ٹیچر احمد'].map((name, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Users size={20} /></div>
                        <span className="font-bold">{name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">حاضر</button>
                        <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 text-xs font-bold border border-slate-100">غیر حاضر</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100">
                  {t('save')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
