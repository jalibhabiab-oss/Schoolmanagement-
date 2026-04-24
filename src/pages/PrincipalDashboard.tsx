import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarCheck, Wallet, FileText, MessageSquare, 
  Banknote, TrendingDown, Contact, CalendarDays, Package, 
  Bus, UserPlus, BarChart3, Video, Settings, Search, 
  Globe, Bell, User, Sparkles, AlertCircle, TrendingUp, 
  Plus, Mic, CheckCircle2, MoreVertical, ChevronRight,
  Menu, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  collection, getDocs, query, where, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

// Mock Data for Charts
const kpiData = [
  { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, 
  { value: 600 }, { value: 550 }, { value: 700 }
];

const STUDENTS = [
  { id: '1', name: 'Zaid Ahmed', roll: '1001', initials: 'ZA' },
  { id: '2', name: 'Fatima Noor', roll: '1002', initials: 'FN' },
  { id: '3', name: 'Hamza Khan', roll: '1003', initials: 'HK' },
  { id: '4', name: 'Ayesha Bibi', roll: '1004', initials: 'AB' },
  { id: '5', name: 'Bilal Raza', roll: '1005', initials: 'BR' },
  { id: '6', name: 'Sara Malik', roll: '1006', initials: 'SM' },
  { id: '7', name: 'Omar Farooq', roll: '1007', initials: 'OF' },
  { id: '8', name: 'Zainab Ali', roll: '1008', initials: 'ZA' },
  { id: '9', name: 'Hassan Shah', roll: '1009', initials: 'HS' },
  { id: '10', name: 'Maryam Khan', roll: '1010', initials: 'MK' },
];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Smart Attendance', icon: CalendarCheck },
  { id: 'fees', label: 'Fee Defaulters', icon: Wallet },
  { id: 'paper', label: 'AI Paper Generator', icon: FileText },
  { id: 'whatsapp', label: 'WhatsApp Blaster', icon: MessageSquare },
  { id: 'payroll', label: 'Staff Payroll', icon: Banknote },
  { id: 'expenses', label: 'Expense Tracker', icon: TrendingDown },
  { id: 'idcard', label: 'ID Card Generator', icon: Contact },
  { id: 'leave', label: 'Leave Management', icon: CalendarDays },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'transport', label: 'Transport Route', icon: Bus },
  { id: 'promotion', label: 'Student Promotion', icon: UserPlus },
  { id: 'analytics', label: 'Exam Analytics', icon: BarChart3 },
  { id: 'cctv', label: 'CCTV Monitor', icon: Video },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PrincipalDashboard = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  // --- Sub-Components ---

  const KPICard = ({ title, value, trend, color, data }: any) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-[2rem] relative overflow-hidden group"
    >
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{title}</p>
          <div className={cn("p-2 rounded-xl", color)}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black text-slate-900">{value}</h3>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-50 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill={`url(#color${title})`} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  const SmartAttendanceView = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [masterToggle, setMasterToggle] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch Classes
    useEffect(() => {
      const fetchClasses = async () => {
        try {
          const q = query(collection(db, 'Classes'), where('school_id', '==', 'school_123'));
          const querySnapshot = await getDocs(q);
          const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClasses(classesData);
          if (classesData.length > 0 && !selectedClass) {
            setSelectedClass(classesData[0].id);
          }
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      };
      fetchClasses();
    }, []);

    // Fetch Students based on selected class
    useEffect(() => {
      const fetchStudents = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
          const q = query(
            collection(db, 'Students'), 
            where('school_id', '==', 'school_123'),
            where('class_id', '==', selectedClass)
          );
          const querySnapshot = await getDocs(q);
          const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Fallback to dummy data if no students found in DB for this class
          const finalStudents = studentsData.length > 0 ? studentsData : STUDENTS.map(s => ({ ...s, class_id: selectedClass }));
          
          setStudents(finalStudents);
          setAttendance(finalStudents.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}));
          setMasterToggle(true);
        } catch (error) {
          console.error("Error fetching students:", error);
          // Fallback on error
          setStudents(STUDENTS);
          setAttendance(STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}));
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }, [selectedClass]);

    const handleMasterToggle = () => {
      const newState = !masterToggle;
      setMasterToggle(newState);
      const newAttendance = { ...attendance };
      students.forEach(s => {
        newAttendance[s.id] = newState;
      });
      setAttendance(newAttendance);
    };

    const toggleStudent = (id: string) => {
      const newAttendance = { ...attendance, [id]: !attendance[id] };
      setAttendance(newAttendance);
      
      if (!newAttendance[id]) {
        setMasterToggle(false);
      } else {
        const allChecked = students.every(s => newAttendance[s.id]);
        if (allChecked) setMasterToggle(true);
      }
    };

    const handleSave = async () => {
      setSaving(true);
      try {
        const present = students.filter(s => attendance[s.id]).map(s => s.id);
        const absent = students.filter(s => !attendance[s.id]).map(s => s.id);
        
        await addDoc(collection(db, 'Student_Attendance'), {
          school_id: 'school_123',
          class_id: selectedClass,
          date: selectedDate,
          present_array: present,
          absent_array: absent,
          marked_by: 'Principal Admin',
          created_at: serverTimestamp(),
        });
        alert('Attendance saved successfully!');
      } catch (error) {
        console.error("Error saving attendance:", error);
        alert('Failed to save attendance.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 pb-24"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Smart Attendance</h2>
              <p className="text-slate-500 font-medium">Manage daily student presence with AI-assisted tracking</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border border-slate-100">
                <CalendarDays size={18} className="text-indigo-600" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none font-bold text-sm text-slate-700"
                />
              </div>
              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border border-slate-100">
                <UserPlus size={18} className="text-indigo-600" />
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent outline-none font-bold text-sm text-slate-700 cursor-pointer min-w-[140px]"
                >
                  {classes.length > 0 ? (
                    classes.map(c => (
                      <option key={c.id} value={c.id}>{c.class_name}</option>
                    ))
                  ) : (
                    <>
                      <option value="9-Science">Class 9-Science</option>
                      <option value="8-A">Class 8-A</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div 
              onClick={handleMasterToggle}
              className="flex-1 md:flex-none flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-200 transition-all"
            >
              <span className="text-sm font-black text-slate-600 px-2">Mark All Present</span>
              <div className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                masterToggle ? "bg-indigo-600" : "bg-slate-200"
              )}>
                <motion.div 
                  animate={{ x: masterToggle ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">Fetching smart roster...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students.map((student) => (
              <motion.div 
                key={student.id}
                layout
                onClick={() => toggleStudent(student.id)}
                className={cn(
                  "glass p-5 rounded-[2rem] flex items-center justify-between group transition-all cursor-pointer border-2",
                  attendance[student.id] 
                    ? "border-transparent bg-white/80" 
                    : "border-rose-100 bg-rose-50/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-colors",
                    attendance[student.id] 
                      ? "bg-indigo-100 text-indigo-600" 
                      : "bg-rose-100 text-rose-600"
                  )}>
                    {student.initials || student.student_name?.substring(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{student.name || student.student_name}</p>
                    <p className="text-xs text-slate-500 font-bold">Roll: {student.roll || student.roll_number}</p>
                  </div>
                </div>
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
                  attendance[student.id] 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "bg-white border-slate-200 text-slate-300"
                )}>
                  <CheckCircle2 size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-500/40 flex items-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={24} />}
            {saving ? 'Saving...' : 'Save Attendance'}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const DashboardHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Students" value="1,240" trend="+12%" color="bg-blue-100 text-blue-600" data={kpiData} />
        <KPICard title="Revenue (PKR)" value="4.2M" trend="+8%" color="bg-emerald-100 text-emerald-600" data={kpiData.map(d => ({ value: d.value * 0.8 }))} />
        <KPICard title="Active Staff" value="86" trend="+2" color="bg-indigo-100 text-indigo-600" data={kpiData.map(d => ({ value: d.value * 1.2 }))} />
        <KPICard title="Absentees Today" value="14" trend="-4%" color="bg-rose-100 text-rose-600" data={kpiData.map(d => ({ value: d.value * 0.5 }))} />
      </div>

      {/* AI Smart Alerts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-600 animate-pulse" size={20} />
          <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Smart Insights</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex gap-5 items-start">
            <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1 space-y-3">
              <h4 className="font-black text-rose-900 text-lg">Fee Defaulters Alert</h4>
              <p className="text-rose-800/70 text-sm leading-relaxed font-medium">
                🚨 45 Students haven't paid fees for the current month. Total pending: <span className="font-bold">PKR 245,000</span>.
              </p>
              <button className="bg-rose-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
                Trigger WhatsApp Blaster
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex gap-5 items-start">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
              <BarChart3 size={24} />
            </div>
            <div className="flex-1 space-y-3">
              <h4 className="font-black text-indigo-900 text-lg">Performance Insight</h4>
              <p className="text-indigo-800/70 text-sm leading-relaxed font-medium">
                📉 Class 9th Math average dropped by <span className="font-bold">12%</span> in the recent mock test. AI suggests a revision session.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Widgets */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Quick Operations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-indigo-50 transition-all group">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-bold text-slate-700 text-sm">Add Quick Expense</span>
          </button>
          <button className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-indigo-50 transition-all group">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <CalendarCheck size={24} />
            </div>
            <span className="font-bold text-slate-700 text-sm">Mark Staff Attendance</span>
          </button>
          <button className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-indigo-50 transition-all group">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Mic size={24} />
            </div>
            <span className="font-bold text-slate-700 text-sm">Voice Result Entry</span>
          </button>
          <button className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-indigo-50 transition-all group">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <span className="font-bold text-slate-700 text-sm">Generate ID Cards</span>
          </button>
        </div>
      </section>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-urdu">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="glass-dark h-full relative z-50 flex flex-col border-r border-slate-800/50"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <Sparkles size={24} />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-xl text-white tracking-tighter"
              >
                EduSmart AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all group relative",
                activeModule === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn("shrink-0", activeModule === item.id ? "text-white" : "group-hover:text-white transition-colors")} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {activeModule === item.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 glass border-b border-slate-100 px-8 flex justify-between items-center shrink-0 z-40">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search student, receipt, staff..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              <Globe size={16} />
              {language === 'en' ? 'English' : 'اردو'}
            </button>

            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">Principal Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super User</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <AnimatePresence mode="wait">
            {activeModule === 'dashboard' ? (
              <DashboardHome key="home" />
            ) : activeModule === 'attendance' ? (
              <SmartAttendanceView key="attendance" />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                  <Sparkles size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{SIDEBAR_ITEMS.find(i => i.id === activeModule)?.label}</h2>
                  <p className="text-slate-500">This module is being optimized by AI. Coming soon.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
