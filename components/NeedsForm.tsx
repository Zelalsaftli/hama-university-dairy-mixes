import React, { useState } from 'react';
import { CowParameters, Nutrients } from '../types';
import { Info, AlertCircle, Minus, Plus, ChevronDown } from 'lucide-react';

interface NeedsFormProps {
  params: CowParameters;
  setParams: (p: CowParameters) => void;
  calculatedNeeds: Nutrients;
}

const NeedsForm: React.FC<NeedsFormProps> = ({ params, setParams, calculatedNeeds }) => {
  const [isNeedsVisible, setIsNeedsVisible] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Special handler for switching to/from Heifer mode
    if (name === 'lactationNumber') {
      const newLactationNumber = Number(value);
      if (newLactationNumber === 0) {
        // Switching to Heifer, clear irrelevant fields
        setParams({
          ...params,
          lactationNumber: 0,
          milkProduction: '',
          fatPercentage: '',
          proteinPercentage: '',
          daysInMilk: '',
          bcsChange: 0,
        });
        return;
      } else {
        // Switching back to a lactating cow
        setParams({ ...params, lactationNumber: newLactationNumber });
        return;
      }
    }
    
    const isNumericInput = ['weight', 'milkProduction', 'fatPercentage', 'proteinPercentage', 'daysInMilk'].includes(name);

    if (isNumericInput) {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setParams({ ...params, [name]: value });
        }
    } else {
        const isNumericSelect = ['pregnancyMonth'].includes(name); // lactationNumber handled separately
        setParams({
            ...params,
            [name]: isNumericSelect ? Number(value) : value,
        } as any);
    }
  };

  const incrementBcs = () => {
    const newValue = parseFloat((params.bcsChange + 0.1).toFixed(1));
    if (newValue <= 1.0) {
        setParams({ ...params, bcsChange: newValue });
    }
  };

  const decrementBcs = () => {
      const newValue = parseFloat((params.bcsChange - 0.1).toFixed(1));
      if (newValue >= -1.0) {
          setParams({ ...params, bcsChange: newValue });
      }
  };
  
  const incrementGrowthRate = () => {
    const newValue = parseFloat((params.growthRate + 0.1).toFixed(1));
    if (newValue <= 1.5) {
        setParams({ ...params, growthRate: newValue });
    }
  };

  const decrementGrowthRate = () => {
      const newValue = parseFloat((params.growthRate - 0.1).toFixed(1));
      if (newValue >= 0) {
          setParams({ ...params, growthRate: newValue });
      }
  };

  const isHeifer = params.lactationNumber === 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">بيانات الحيوان والعوامل البيئية (NRC 2021)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* New Factors */}
          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">السلالة</label>
            <select
              name="breed"
              value={params.breed}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="holstein">هولشتاين (Holstein)</option>
              <option value="jersey">جيرسي (Jersey)</option>
              <option value="other">أخرى / هجين</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">يؤثر على طاقة الحافظة</p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">مرحلة النضج / موسم الحليب</label>
            <select
              name="lactationNumber"
              value={params.lactationNumber}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="0">عجلة غير ناضجة (Heifer)</option>
              <option value="1">الموسم الأول (بكيرة - Primiparous)</option>
              <option value="2">الموسم الثاني</option>
              <option value="3">الموسم الثالث فأكثر (Mature)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">يؤثر على النمو والشهية</p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">الوزن الحي (كغ)</label>
            <input
              type="text"
              inputMode="decimal"
              lang="en"
              name="weight"
              value={params.weight}
              onChange={handleChange}
              placeholder="مثال: 600"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-right"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">إنتاج الحليب اليومي (كغ)</label>
            <input
              type="text"
              inputMode="decimal"
              lang="en"
              name="milkProduction"
              value={params.milkProduction}
              onChange={handleChange}
              placeholder={isHeifer ? "غير مطلوب للعجلات" : "مثال: 25"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-right disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={isHeifer}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة الدهن (%)</label>
            <input
              type="text"
              inputMode="decimal"
              lang="en"
              name="fatPercentage"
              value={params.fatPercentage}
              onChange={handleChange}
              placeholder={isHeifer ? "-" : "مثال: 3.8"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-right disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={isHeifer}
            />
          </div>

           <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة البروتين (%)</label>
            <input
              type="text"
              inputMode="decimal"
              lang="en"
              name="proteinPercentage"
              value={params.proteinPercentage}
              onChange={handleChange}
              placeholder={isHeifer ? "-" : "مثال: 3.2"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-right disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={isHeifer}
            />
          </div>

           <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">أيام الحليب (DIM)</label>
            <input
              type="text"
              inputMode="decimal"
              lang="en"
              name="daysInMilk"
              value={params.daysInMilk}
              onChange={handleChange}
              placeholder={isHeifer ? "-" : "عدد الأيام بعد الولادة"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-right disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={isHeifer}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">شهر الحمل</label>
            <select
              name="pregnancyMonth"
              value={params.pregnancyMonth}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="0">غير عشار (Not Pregnant)</option>
              <option value="1">الشهر الأول</option>
              <option value="2">الشهر الثاني</option>
              <option value="3">الشهر الثالث</option>
              <option value="4">الشهر الرابع</option>
              <option value="5">الشهر الخامس</option>
              <option value="6">الشهر السادس</option>
              <option value="7">الشهر السابع</option>
              <option value="8">الشهر الثامن</option>
              <option value="9">الشهر التاسع</option>
            </select>
          </div>

          <div className="form-group">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-center">معدل النمو (كغ/يوم)</label>
              <div className="flex items-center justify-center w-full gap-2">
                  <button
                      type="button"
                      onClick={decrementGrowthRate}
                      disabled={params.growthRate <= 0}
                      className="p-3 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="نقصان معدل النمو"
                  >
                      <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center font-bold text-2xl text-slate-800 tabular-nums ltr w-32 py-2 border border-slate-300 rounded-lg bg-white">
                      {params.growthRate.toFixed(1)}
                  </div>
                  <button
                      type="button"
                      onClick={incrementGrowthRate}
                      disabled={params.growthRate >= 1.5}
                      className="p-3 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="زيادة معدل النمو"
                  >
                      <Plus className="w-5 h-5" />
                  </button>
              </div>
              {isHeifer ? (
                   <p className="text-[10px] text-emerald-700 mt-2 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      هذا هو العامل الأساسي لنمو العجلات
                  </p>
              ) : (
                  params.lactationNumber < 3 && params.growthRate === 0 && (
                      <p className="text-[10px] text-green-600 mt-2 text-center flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          سيتم إضافة نمو تقديري للأبقار في الموسم 1 و 2
                      </p>
                  )
              )}
          </div>

          <div className="form-group">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-center">تغير الوزن اليومي (كغ/يوم)</label>
              <div className="flex items-center justify-center w-full gap-2">
                  <button
                      type="button"
                      onClick={decrementBcs}
                      disabled={isHeifer || params.bcsChange <= -1.0}
                      className="p-3 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="نقصان تغير الوزن اليومي"
                  >
                      <Minus className="w-5 h-5" />
                  </button>
                  <div className={`text-center font-bold text-2xl text-slate-800 tabular-nums ltr w-32 py-2 border border-slate-300 rounded-lg ${isHeifer ? 'bg-slate-100' : 'bg-white'}`}>
                      {params.bcsChange > 0 ? '+' : ''}{params.bcsChange.toFixed(1)}
                  </div>
                  <button
                      type="button"
                      onClick={incrementBcs}
                      disabled={isHeifer || params.bcsChange >= 1.0}
                      className="p-3 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="زيادة تغير الوزن اليومي"
                  >
                      <Plus className="w-5 h-5" />
                  </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                  {isHeifer ? 'غير مطلوب للعجلات' : 'لتحسين شرط الجسم (BCS)'}
              </p>
          </div>

          {/* New Environment Inputs */}
          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">الظروف البيئية (الإجهاد الحراري)</label>
            <select
              name="environment"
              value={params.environment}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="neutral">طبيعي (5 - 25 مئوية)</option>
              <option value="heat_mild">إجهاد حراري خفيف (25-30 مئوية)</option>
              <option value="heat_severe">إجهاد حراري شديد (&gt; 30 مئوية)</option>
              <option value="cold">إجهاد برد (&lt; 0 مئوية)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نظام الإيواء والرعي</label>
            <select
              name="grazing"
              value={params.grazing}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="none">حظائر مغلقة (بدون رعي)</option>
              <option value="flat">رعي في أرض سهلة</option>
              <option value="hilly">رعي في أرض جبلية/وعرة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculated Requirements Display */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsNeedsVisible(!isNeedsVisible)}
          className="w-full flex justify-between items-center p-6 text-left hover:bg-emerald-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={isNeedsVisible}
          aria-controls="needs-content"
        >
          <h3 className="text-xl font-bold text-emerald-800">
            الاحتياجات الغذائية اليومية المقدرة (NRC 2021)
          </h3>
          <ChevronDown
            className={`w-6 h-6 text-emerald-700 transition-transform duration-300 ${isNeedsVisible ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {isNeedsVisible && (
          <div id="needs-content" className="p-6 pt-0 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-1">
                       <Info className="w-4 h-4 text-slate-300" />
                     </div>
                    <p className="text-sm text-slate-500 mb-1">القدرة على استهلاك العلف (DMI)</p>
                    <div className="text-2xl font-bold text-slate-700 ltr">{calculatedNeeds.predictedDmi?.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span></div>
                    <div className="text-[10px] text-slate-400 mt-1">المادة الجافة المتوقعة</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">الطاقة الاستقلابية (ME)</p>
                    <div className="text-2xl font-bold text-emerald-600 ltr">{calculatedNeeds.me.toFixed(1)} <span className="text-sm font-normal text-slate-400">Mcal</span></div>
                    <div className="mt-1 pt-1 border-t border-slate-100">
                        <span className="text-lg font-bold text-emerald-500 ltr">{(calculatedNeeds.me * 4.184).toFixed(1)}</span>
                        <span className="text-xs text-slate-400 mr-1">MJ</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">البروتين الخام (CP)</p>
                    <p className="text-2xl font-bold text-blue-600 ltr">{calculatedNeeds.cp}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">الكالسيوم (Ca)</p>
                    <p className="text-2xl font-bold text-orange-600 ltr">{calculatedNeeds.ca}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">الفوسفور (P)</p>
                    <p className="text-2xl font-bold text-purple-600 ltr">{calculatedNeeds.p}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">NDF (ألياف)</p>
                    <p className="text-2xl font-bold text-teal-600 ltr">{calculatedNeeds.ndf}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">ADF (ألياف)</p>
                    <p className="text-2xl font-bold text-cyan-600 ltr">{calculatedNeeds.adf}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">النشاء (Starch)</p>
                    <p className="text-2xl font-bold text-yellow-600 ltr">{calculatedNeeds.starch}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">السكر (Sugar)</p>
                    <p className="text-2xl font-bold text-pink-600 ltr">{calculatedNeeds.sugar}</p>
                    <p className="text-xs text-slate-400">g/day</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedsForm;