import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Nutrients } from '../types';
import { Coins, TrendingUp, Printer, XCircle, Scale, PieChart, Share2 } from 'lucide-react';

interface ComparisonProps {
  needs: Nutrients;
  supplied: Nutrients;
  totalDM: number;
  totalCost: number;
  milkProduction: number;
  rationStructure: { 
      concentrateDM: number; 
      forageDM: number; 
      concentratePercent: number; 
      foragePercent: number; 
  };
}

const Comparison: React.FC<ComparisonProps> = ({ 
  needs, 
  supplied, 
  totalDM, 
  totalCost, 
  milkProduction, 
  rationStructure 
}) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  
  // Safe access to properties with defaults to prevent crashes if state is initializing
  const data = [
    { name: 'الطاقة (Mcal)', required: needs?.me || 0, supplied: supplied?.me || 0, unit: 'Mcal' },
    { name: 'البروتين (g/10)', required: Math.round((needs?.cp || 0) / 10), supplied: Math.round((supplied?.cp || 0) / 10), unit: 'x10 g' },
    { name: 'Ca (g)', required: needs?.ca || 0, supplied: supplied?.ca || 0, unit: 'g' },
    { name: 'NDF (g/10)', required: Math.round((needs?.ndf || 0)/10), supplied: Math.round((supplied?.ndf || 0)/10), unit: 'x10 g' },
  ];

  const getStatusColor = (req: number, sup: number, isMaxLimit: boolean = false) => {
    if (isMaxLimit) {
        if (sup > req) return 'text-red-600 bg-red-50';
        return 'text-green-600 bg-green-50';
    }
    if (req === 0) return 'text-slate-600 bg-slate-50';

    const diff = ((sup - req) / req) * 100;
    if (diff < -10) return 'text-red-600 bg-red-50';
    if (diff > 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (req: number, sup: number, isMaxLimit: boolean = false) => {
      if (isMaxLimit) {
          if (sup > req) return `تجاوز الحد (${req > 0 ? Math.round(((sup - req)/req)*100) : '∞'}%)`;
          return 'آمن';
      }
      if (req === 0) return '-';

      const diff = ((sup - req) / req) * 100;
      if (diff < -10) return `نقص (${Math.abs(Math.round(diff))}%)`;
      if (diff > 20) return `زائد (${Math.round(diff)}%)`;
      return 'متوازن';
  };

  const costPerKgMilk = milkProduction > 0 ? totalCost / milkProduction : 0;
  const dmiPercent = needs.predictedDmi && needs.predictedDmi > 0 ? (totalDM / needs.predictedDmi) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if(window.confirm('هل تريد إعادة تعيين التطبيق والبدء من جديد؟')) {
        window.location.reload();
    }
  };
  
  const handleShare = async () => {
    const summaryText = `
ملخص عليقة الأبقار - تم إنشاؤه بواسطة خبير تغذية الأبقار
----------------------------------
📊 التحليل الاقتصادي:
- التكلفة اليومية: ${totalCost.toFixed(2)} دولار
- تكلفة 1 كغ حليب: ${costPerKgMilk.toFixed(2)} دولار

⚖️ توازن العليقة:
- المادة الجافة المتناولة (DMI): ${totalDM.toFixed(1)} كغ
- الطاقة (ME): ${supplied.me.toFixed(1)} / ${needs.me.toFixed(1)} Mcal
- البروتين (CP): ${supplied.cp.toFixed(0)} / ${needs.cp.toFixed(0)} غرام
- نسبة المالئ:المركز: ${rationStructure.foragePercent}% / ${rationStructure.concentratePercent}%

تم حساب هذه العليقة باستخدام تطبيق "خبير تغذية الأبقار".
    `;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'ملخص عليقة الأبقار',
                text: summaryText,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        navigator.clipboard.writeText(summaryText.trim()).then(() => {
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        });
    }
  };


  return (
    <div className="space-y-8">
        {/* Economic Analysis */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg print-break-inside-avoid">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="text-yellow-400" />
                التحليل الاقتصادي (يومياً)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">تكلفة العليقة اليومية</p>
                    <p className="text-3xl font-bold text-yellow-400">{totalCost.toFixed(2)} <span className="text-sm">دولار</span></p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">تكلفة إنتاج 1 كغ حليب</p>
                    <p className="text-3xl font-bold text-green-400">{costPerKgMilk.toFixed(2)} <span className="text-sm">دولار/كغ</span></p>
                </div>
                 <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">كفاءة التحويل (حليب/علف جاف)</p>
                    <p className="text-3xl font-bold text-blue-400">{(totalDM > 0 ? milkProduction / totalDM : 0).toFixed(2)}</p>
                </div>
            </div>
        </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" />
            مقارنة الاحتياجات مع المقدم
        </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* DMI Alert */}
            <div className={`p-4 rounded-lg border flex items-center gap-4 ${Math.abs(dmiPercent - 100) < 10 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                <div className="p-2 bg-white rounded-full shadow-sm">
                    <Scale className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="font-bold text-lg">توازن الشهية (DMI)</div>
                    <div className="text-xs mt-1">
                         المخطط: <span className="font-bold">{totalDM.toFixed(1)}</span> / المتوقع: <span className="font-bold">{needs.predictedDmi}</span> كغ
                    </div>
                </div>
                <div className="font-bold text-xl ltr">
                    {dmiPercent.toFixed(0)}%
                </div>
            </div>

            {/* Ration Structure Ratio */}
             <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-5 h-5 text-slate-600" />
                    <span className="font-bold text-slate-700">نسبة المالئ : المركز (أساس جاف)</span>
                </div>
                
                <div className="h-6 w-full bg-slate-200 rounded-full overflow-hidden flex text-xs font-bold text-white mb-2">
                    <div 
                        className="bg-emerald-500 flex items-center justify-center transition-all duration-500" 
                        style={{ width: `${rationStructure.foragePercent}%` }}
                    >
                       {rationStructure.foragePercent > 10 && `مالئ ${rationStructure.foragePercent}%`}
                    </div>
                    <div 
                        className="bg-yellow-500 flex items-center justify-center transition-all duration-500" 
                        style={{ width: `${rationStructure.concentratePercent}%` }}
                    >
                       {rationStructure.concentratePercent > 10 && `مركز ${rationStructure.concentratePercent}%`}
                    </div>
                </div>

                <div className="flex justify-between text-xs font-medium">
                     <span className={rationStructure.foragePercent < 40 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                         {rationStructure.foragePercent < 40 ? 'تحذير: نقص ألياف!' : 'مستوى مالئ جيد'}
                     </span>
                     <span className={rationStructure.concentratePercent > 60 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                         {rationStructure.concentratePercent > 60 ? 'خطر حماض!' : 'مستوى مركز آمن'}
                     </span>
                </div>
            </div>
         </div>
        
        {/* Table View */}
        <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-right text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                    <tr>
                        <th className="px-6 py-3 rounded-r-lg">العنصر الغذائي</th>
                        <th className="px-6 py-3">الاحتياجات / الحدود</th>
                        <th className="px-6 py-3">المقدم في العليقة</th>
                        <th className="px-6 py-3">النسبة في العليقة (DM)</th>
                        <th className="px-6 py-3 rounded-l-lg">الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">الطاقة (ME)</td>
                        <td className="px-6 py-4">{needs?.me} Mcal</td>
                        <td className="px-6 py-4">{supplied?.me} Mcal</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.me / totalDM : 0).toFixed(2)} Mcal/kg</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.me, supplied?.me)}`}>
                                {getStatusText(needs?.me, supplied?.me)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">البروتين الخام (CP)</td>
                        <td className="px-6 py-4">{needs?.cp} g</td>
                        <td className="px-6 py-4">{supplied?.cp} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.cp / (totalDM * 10) : 0).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.cp, supplied?.cp)}`}>
                                {getStatusText(needs?.cp, supplied?.cp)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">NDF (ألياف متعادلة)</td>
                        <td className="px-6 py-4">Min {needs?.ndf} g</td>
                        <td className="px-6 py-4">{supplied?.ndf} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.ndf / (totalDM * 10) : 0).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${supplied?.ndf < needs?.ndf ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {supplied?.ndf < needs?.ndf ? 'منخفض (خطر)' : 'جيد'}
                            </span>
                        </td>
                    </tr>
                     <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">ADF (ألياف حامضية)</td>
                        <td className="px-6 py-4">Min {needs?.adf} g</td>
                        <td className="px-6 py-4">{supplied?.adf} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.adf / (totalDM * 10) : 0).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${supplied?.adf < needs?.adf ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {supplied?.adf < needs?.adf ? 'منخفض' : 'جيد'}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">النشاء (Starch)</td>
                        <td className="px-6 py-4">Max {needs?.starch} g</td>
                        <td className="px-6 py-4">{supplied?.starch} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.starch / (totalDM * 10) : 0).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.starch, supplied?.starch, true)}`}>
                                {getStatusText(needs?.starch, supplied?.starch, true)}
                            </span>
                        </td>
                    </tr>
                     <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">السكر (Sugar)</td>
                        <td className="px-6 py-4">~ {needs?.sugar} g</td>
                        <td className="px-6 py-4">{supplied?.sugar} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.sugar / (totalDM * 10) : 0).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className="text-slate-400 text-xs">-</span>
                        </td>
                    </tr>
                     <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">الكالسيوم (Ca)</td>
                        <td className="px-6 py-4">{needs?.ca} g</td>
                        <td className="px-6 py-4">{supplied?.ca} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.ca / (totalDM * 10) : 0).toFixed(2)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.ca, supplied?.ca)}`}>
                                {getStatusText(needs?.ca, supplied?.ca)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-slate-900">الفوسفور (P)</td>
                        <td className="px-6 py-4">{needs?.p} g</td>
                        <td className="px-6 py-4">{supplied?.p} g</td>
                        <td className="px-6 py-4 ltr text-right">{(totalDM > 0 ? supplied?.p / (totalDM * 10) : 0).toFixed(2)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.p, supplied?.p)}`}>
                                {getStatusText(needs?.p, supplied?.p)}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Chart View */}
        <div className="w-full mt-8 ltr" dir="ltr">
             <ResponsiveContainer width="100%" height={320}>
                <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" fill="#94a3b8" name="المطلوب/الحد الأدنى" />
                <Bar dataKey="supplied" fill="#10b981" name="المقدم" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-6 bg-slate-50 p-4 rounded text-center text-slate-600">
            إجمالي المادة الجافة المتناولة (DMI): <span className="font-bold text-slate-900">{totalDM.toFixed(1)} كغ</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 no-print">
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all font-bold"
            >
                <Share2 className="w-5 h-5" />
                {shareStatus === 'copied' ? 'تم النسخ!' : 'مشاركة'}
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all font-bold"
            >
                <Printer className="w-5 h-5" />
                طباعة التقرير
            </button>
             <button 
                onClick={handleClose}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg shadow-md transition-all font-bold"
            >
                <XCircle className="w-5 h-5" />
                إنهاء / إغلاق
            </button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;