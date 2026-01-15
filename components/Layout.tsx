import React from 'react';
import { Leaf, Activity, BarChart3, Printer, RotateCcw, BookOpen, Save, Upload } from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  activePage: Page;
  setPage: (p: Page) => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activePage, setPage, onReset, onSave, onLoad, children }) => {
  const navItems = [
    { id: Page.NEEDS, label: 'الاحتياجات', icon: Activity },
    { id: Page.FEED, label: 'تركيب العليقة', icon: Leaf },
    { id: Page.COMPARE, label: 'التحليل والمقارنة', icon: BarChart3 },
    { id: Page.GUIDANCE, label: 'إرشادات عامة', icon: BookOpen },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
               <Leaf className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold">خبير تغذية الأبقار</h1>
              <p className="text-xs text-emerald-100 opacity-80">نظام ذكي لتركيب العلائق</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={onSave}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="حفظ العليقة الحالية"
            >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">حفظ</span>
            </button>
             <button 
                onClick={onLoad}
                className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="تحميل عليقة محفوظة"
            >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">تحميل</span>
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="طباعة"
            >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">طباعة</span>
            </button>
            <button 
                onClick={onReset}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="إعادة تعيين / جديد"
            >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">جديد</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-sm border-b sticky top-[76px] z-40 overflow-x-auto no-print">
         <nav className="container mx-auto flex md:justify-center px-4 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-6 py-4 transition-colors border-b-2 whitespace-nowrap ${
                  activePage === item.id
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50 font-bold'
                    : 'border-transparent text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
         </nav>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-400 py-8 text-center mt-auto no-print border-t border-slate-700">
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <h3 className="text-md font-bold text-emerald-400 mb-2">تقديم الطلاب</h3>
                <p className="text-slate-300 text-sm">وفاء طهماز &bull; خالد السلوم &bull; عمر الأحمد &bull; ميس الداود</p>
            </div>
            <div className="mt-4">
                <h3 className="text-md font-bold text-emerald-400 mb-2">إشراف</h3>
                <p className="text-slate-300 text-sm">د. ظلال الصافتلي &bull; م. بتول المير سليمان</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500">قسم الإنتاج الحيواني | كلية الهندسة الزراعية | جامعة حماه</p>
                <p className="text-xs opacity-80 font-mono ltr mt-2">2026</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;