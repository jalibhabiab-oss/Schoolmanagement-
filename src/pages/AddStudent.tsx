import React, { useState } from 'react';
import { ArrowRight, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    class_name: '',
    roll_number: '',
    parent_whatsapp: '',
    monthly_fee: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      await addDoc(collection(db, 'Students'), {
        ...formData,
        school_id: 'school_123', // Hardcoded for demo
        monthly_fee: Number(formData.monthly_fee),
        status: 'active',
        joined_date: new Date(),
      });
      setStatus('success');
      setFormData({
        student_name: '',
        father_name: '',
        class_name: '',
        roll_number: '',
        parent_whatsapp: '',
        monthly_fee: '',
      });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Error adding student:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">نیا طالب علم شامل کریں</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-3xl max-w-md mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600 px-1">طالب علم کا نام</label>
            <input 
              required
              type="text"
              value={formData.student_name}
              onChange={(e) => setFormData({...formData, student_name: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="نام درج کریں"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600 px-1">والد کا نام</label>
            <input 
              required
              type="text"
              value={formData.father_name}
              onChange={(e) => setFormData({...formData, father_name: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="والد کا نام درج کریں"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 px-1">کلاس</label>
              <input 
                required
                type="text"
                value={formData.class_name}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="مثلاً: 8-A"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 px-1">رول نمبر</label>
              <input 
                required
                type="text"
                value={formData.roll_number}
                onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="رول نمبر"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600 px-1">واٹس ایپ نمبر</label>
            <input 
              required
              type="tel"
              value={formData.parent_whatsapp}
              onChange={(e) => setFormData({...formData, parent_whatsapp: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-left"
              dir="ltr"
              placeholder="03xx xxxxxxx"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600 px-1">ماہانہ فیس</label>
            <input 
              required
              type="number"
              value={formData.monthly_fee}
              onChange={(e) => setFormData({...formData, monthly_fee: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="فیس کی رقم"
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
            محفوظ کریں
          </button>
        </form>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <CheckCircle2 size={18} />
              طالب علم کامیابی سے شامل کر لیا گیا!
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <AlertCircle size={18} />
              غلطی! دوبارہ کوشش کریں۔
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AddStudent;
