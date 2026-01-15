import React, { useMemo, useState } from 'react';
import { RationItem, Nutrients, FeedIngredient } from '../types';
import { Calculator, Settings, X, Save, Trash2, PlusCircle, ListFilter, Search, ArrowDownUp } from 'lucide-react';

interface FeedFormProps {
  concentrateMix: RationItem[];
  setConcentrateMix: (items: RationItem[]) => void;
  concentrateFedAmount: string;
  setConcentrateFedAmount: (s: string) => void;
  forages: RationItem[];
  setForages: (items: RationItem[]) => void;
  mixAnalysis: Nutrients;
  concentrateMixDMPercent: number;
  ingredients: FeedIngredient[];
  onAddNewIngredient: (data: Omit<FeedIngredient, 'id'>) => void;
  onDeleteIngredient: (id: string) => void;
  visibleIngredientIds: string[];
  setVisibleIngredientIds: (ids: string[]) => void;
  supplied: Nutrients;
  totalDM: number;
  totalAsFed: number;
}

// Type definition for the form state, ensuring all inputs are handled as strings.
type NewIngredientFormState = {
    [K in keyof Omit<FeedIngredient, 'id' | 'type'>]: string;
} & { type: 'concentrate' | 'forage' };

// Initial state for the "Add Ingredient" form, using strings for all fields.
const initialNewIngredientFormState: NewIngredientFormState = {
    name: '',
    type: 'concentrate',
    dm: '', me: '', cp: '', ca: '', p: '',
    starch: '', sugar: '', ndf: '', adf: '',
    defaultPrice: ''
};

const IngredientVisibilityModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    ingredients: FeedIngredient[];
    visibleIds: string[];
    setVisibleIds: (ids: string[]) => void;
}> = ({ isOpen, onClose, ingredients, visibleIds, setVisibleIds }) => {
    if (!isOpen) return null;

    const allConcentrates = ingredients.filter(i => i.type === 'concentrate');
    const allForages = ingredients.filter(i => i.type === 'forage');

    const handleToggle = (id: string) => {
        const newVisibleIds = visibleIds.includes(id)
            ? visibleIds.filter(vid => vid !== id)
            : [...visibleIds, id];
        setVisibleIds(newVisibleIds);
    };

    const handleSelectAll = (type: 'concentrate' | 'forage') => {
        const idsToSelect = ingredients.filter(i => i.type === type).map(i => i.id);
        setVisibleIds(Array.from(new Set([...visibleIds, ...idsToSelect])));
    };

    const handleDeselectAll = (type: 'concentrate' | 'forage') => {
        const idsToDeselect = ingredients.filter(i => i.type === type).map(i => i.id);
        setVisibleIds(visibleIds.filter(id => !idsToDeselect.includes(id)));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-full overflow-y-auto animate-fade-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-bold text-slate-800">إدارة عرض المواد العلفية</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Concentrates */}
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3">المركزات</h4>
                        <div className="flex items-center gap-2 mb-3">
                            <button onClick={() => handleSelectAll('concentrate')} className="text-xs text-emerald-600 hover:underline">تحديد الكل</button>
                            <span className="text-slate-300">|</span>
                            <button onClick={() => handleDeselectAll('concentrate')} className="text-xs text-red-600 hover:underline">إلغاء تحديد الكل</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                            {allConcentrates.map(ing => (
                                <label key={ing.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" checked={visibleIds.includes(ing.id)} onChange={() => handleToggle(ing.id)} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                                    <span>{ing.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Forages */}
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3">الأعلاف المالئة</h4>
                         <div className="flex items-center gap-2 mb-3">
                            <button onClick={() => handleSelectAll('forage')} className="text-xs text-emerald-600 hover:underline">تحديد الكل</button>
                            <span className="text-slate-300">|</span>
                            <button onClick={() => handleDeselectAll('forage')} className="text-xs text-red-600 hover:underline">إلغاء تحديد الكل</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                             {allForages.map(ing => (
                                <label key={ing.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" checked={visibleIds.includes(ing.id)} onChange={() => handleToggle(ing.id)} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                                    <span>{ing.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 sticky bottom-0 z-10">
                    <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeedForm: React.FC<FeedFormProps> = ({
  concentrateMix,
  setConcentrateMix,
  concentrateFedAmount,
  setConcentrateFedAmount,
  forages,
  setForages,
  mixAnalysis,
  concentrateMixDMPercent,
  ingredients,
  onAddNewIngredient,
  onDeleteIngredient,
  visibleIngredientIds,
  setVisibleIngredientIds,
  supplied,
  totalDM,
  totalAsFed
}) => {

  const [editingIngredient, setEditingIngredient] = useState<FeedIngredient | null>(null);
  const [modalFormState, setModalFormState] = useState<Record<string, string>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIngredientFormState, setNewIngredientFormState] = useState(initialNewIngredientFormState);
  
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);

  const concentrateOptions = useMemo(() => {
    return ingredients.filter(f => f.type === 'concentrate' && visibleIngredientIds.includes(f.id));
  }, [ingredients, visibleIngredientIds]);

  const forageOptions = useMemo(() => {
    return ingredients.filter(f => f.type === 'forage' && visibleIngredientIds.includes(f.id));
  }, [ingredients, visibleIngredientIds]);
  
  const totalMixAmount = useMemo(() => 
    concentrateMix.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0), [concentrateMix]);

  const updateMixItem = (id: string, amount: string) => {
    // Only allow valid decimal patterns
    if (amount !== '' && !/^\d*\.?\d*$/.test(amount)) return;

    const existing = concentrateMix.find(i => i.ingredientId === id);

    if (amount === '') {
      // If the input is cleared, remove the item
      if (existing) {
        setConcentrateMix(concentrateMix.filter(i => i.ingredientId !== id));
      }
      return;
    }

    if (existing) {
      // If item exists, update its amount
      setConcentrateMix(concentrateMix.map(i => i.ingredientId === id ? { ...i, amount } : i));
    } else {
      // If it's a new item, add it to the mix
      setConcentrateMix([...concentrateMix, { ingredientId: id, amount, isPercentage: true }]);
    }
  };

  const updateForageItem = (id: string, amount: string) => {
    // Only allow valid decimal patterns
    if (amount !== '' && !/^\d*\.?\d*$/.test(amount)) return;

    const existing = forages.find(i => i.ingredientId === id);

    if (amount === '') {
      // If the input is cleared, remove the item
      if (existing) {
        setForages(forages.filter(i => i.ingredientId !== id));
      }
      return;
    }

    if (existing) {
      // If item exists, update its amount
      setForages(forages.map(i => i.ingredientId === id ? { ...i, amount } : i));
    } else {
      // If it's a new item, add it to the mix
      setForages([...forages, { ingredientId: id, amount }]);
    }
  };

  const mixPricePerKg = useMemo(() => {
    const totalAsFedParts = concentrateMix.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    if (totalAsFedParts === 0) return 0;
    
    const totalCost = concentrateMix.reduce((acc, item) => {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        return acc + ((parseFloat(item.amount) || 0) * (ingredient?.defaultPrice || 0));
    }, 0);

    return totalCost / totalAsFedParts;
  }, [concentrateMix, ingredients]);

  const handleEditIngredient = (ingredientId: string) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (ingredient) {
      setEditingIngredient(ingredient);
      
      const formState: Record<string, string> = {};
      // Initialize all numeric fields to empty string for override, but keep name.
      for (const key in ingredient) {
          if (key === 'name') {
              formState[key] = String(ingredient[key]);
          } else if (key !== 'id' && key !== 'type') {
              formState[key] = '';
          }
      }
      setModalFormState(formState);
      setIsEditModalOpen(true);
    }
  };
  
  const handleSaveIngredient = () => {
    // This function is currently not connected as edit logic needs lifting up too.
    // For now, it remains as a local placeholder. To fully enable, lift setIngredients up.
    if (editingIngredient) {
      console.warn("Save ingredient is not fully implemented after refactor.");
      handleCloseEditModal();
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingIngredient(null);
    setModalFormState({});
  };
  
  const handleFedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setConcentrateFedAmount(value);
      }
  }

  const handleEditModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalFormState(prev => ({...prev, [name]: value }));
  };
  
  // Handlers for Add Ingredient Modal
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
      setIsAddModalOpen(false);
      setNewIngredientFormState(initialNewIngredientFormState);
  };

  const handleNewIngredientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumericField = name !== 'name' && name !== 'type';

    if (isNumericField) {
      // Allow only valid decimal patterns
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setNewIngredientFormState(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setNewIngredientFormState(prev => ({ ...prev, [name]: value as 'concentrate' | 'forage' }));
    }
  };

  const handleAddNewIngredient = () => {
    if (!newIngredientFormState.name.trim()) {
        alert("يرجى إدخال اسم المادة العلفية.");
        return;
    }
    const dataToSubmit: Omit<FeedIngredient, 'id'> = {
        name: newIngredientFormState.name.trim(),
        type: newIngredientFormState.type,
        dm: Number(newIngredientFormState.dm) || 0,
        me: Number(newIngredientFormState.me) || 0,
        cp: Number(newIngredientFormState.cp) || 0,
        ca: Number(newIngredientFormState.ca) || 0,
        p: Number(newIngredientFormState.p) || 0,
        starch: Number(newIngredientFormState.starch) || 0,
        sugar: Number(newIngredientFormState.sugar) || 0,
        ndf: Number(newIngredientFormState.ndf) || 0,
        adf: Number(newIngredientFormState.adf) || 0,
        defaultPrice: Number(newIngredientFormState.defaultPrice) || 0,
    };
    onAddNewIngredient(dataToSubmit);
    handleCloseAddModal();
  };
  
  const dmFactor = useMemo(() => concentrateMixDMPercent > 0 ? 100 / concentrateMixDMPercent : 0, [concentrateMixDMPercent]);


  return (
    <div className="space-y-8">
      {/* Concentrate Mix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-slate-800">1. تركيب الخلطة المركزة (على أساس المادة الرطبة)</h2>
            <div className="flex items-center gap-2">
                 <button
                    onClick={() => setIsVisibilityModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
                    title="إدارة عرض المواد العلفية"
                >
                    <ListFilter className="w-4 h-4" />
                    <span>إدارة العرض</span>
                </button>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>إضافة مادة</span>
                </button>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 rounded-r-lg">المادة العلفية</th>
                  <th className="px-4 py-3">الكمية (كغ رطب)</th>
                  <th className="px-4 py-3 rounded-l-lg text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {concentrateOptions.map(ing => (
                  <tr key={ing.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-800">
                      <div>{ing.name}</div>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        lang="en"
                        value={concentrateMix.find(i => i.ingredientId === ing.id)?.amount || ''}
                        onChange={(e) => updateMixItem(ing.id, e.target.value)}
                        placeholder="0"
                        className="w-24 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-center"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                       <div className="flex items-center justify-center gap-2">
                         <button onClick={() => handleEditIngredient(ing.id)} className="text-slate-400 hover:text-emerald-600 p-1" title="عرض التحليل وتعديل الخصائص">
                            <Settings className="w-4 h-4" />
                         </button>
                         <button onClick={() => onDeleteIngredient(ing.id)} className="text-slate-400 hover:text-red-600 p-1" title="حذف المادة">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
               <tfoot className="sticky bottom-0 bg-slate-200 font-bold">
                  <tr>
                    <td className={`px-4 py-3 rounded-r-lg text-slate-800`}>
                        المجموع
                    </td>
                    <td className={`px-4 py-3 ltr text-right text-slate-800`}>
                        {totalMixAmount.toFixed(2)} كغ
                    </td>
                    <td className="px-4 py-3 rounded-l-lg"></td>
                  </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Mix Analysis & Fed Amount */}
        <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <Calculator />
                    <span>تحليل خلطة المركزات</span>
                </h3>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-sm text-center">
                    {/* Header */}
                    <div className="font-bold text-slate-600 text-right self-end pb-1">المكون</div>
                    <div className="font-bold text-slate-800 bg-slate-200 rounded-t-md py-1">رطب</div>
                    <div className="font-bold text-slate-800 bg-slate-200 rounded-t-md py-1">جاف</div>

                    {/* ME Row */}
                    <div className="font-medium text-slate-600 self-center text-right border-t pt-2">الطاقة (ME)</div>
                    <div className="font-bold text-emerald-700 ltr border-t pt-2">{mixAnalysis.me.toFixed(2)}</div>
                    <div className="font-bold text-emerald-700 ltr border-t pt-2">{(mixAnalysis.me * dmFactor).toFixed(2)}</div>

                    {/* CP Row */}
                    <div className="font-medium text-slate-600 self-center text-right">البروتين (CP)</div>
                    <div className="font-bold text-blue-700 ltr">{(mixAnalysis.cp / 10).toFixed(1)}%</div>
                    <div className="font-bold text-blue-700 ltr">{((mixAnalysis.cp / 10) * dmFactor).toFixed(1)}%</div>
                    
                    {/* Ca Row */}
                    <div className="font-medium text-slate-600 self-center text-right">الكالسيوم (Ca)</div>
                    <div className="font-bold text-orange-700 ltr">{(mixAnalysis.ca / 10).toFixed(2)}%</div>
                    <div className="font-bold text-orange-700 ltr">{((mixAnalysis.ca / 10) * dmFactor).toFixed(2)}%</div>
                    
                    {/* P Row */}
                    <div className="font-medium text-slate-600 self-center text-right">الفوسفور (P)</div>
                    <div className="font-bold text-purple-700 ltr">{(mixAnalysis.p / 10).toFixed(2)}%</div>
                    <div className="font-bold text-purple-700 ltr">{((mixAnalysis.p / 10) * dmFactor).toFixed(2)}%</div>

                    {/* Starch Row */}
                    <div className="font-medium text-slate-600 self-center text-right border-t pt-2">النشاء</div>
                    <div className="font-bold text-yellow-700 ltr border-t pt-2">{(mixAnalysis.starch / 10).toFixed(1)}%</div>
                    <div className="font-bold text-yellow-700 ltr border-t pt-2">{((mixAnalysis.starch / 10) * dmFactor).toFixed(1)}%</div>

                    {/* NDF Row */}
                    <div className="font-medium text-slate-600 self-center text-right">NDF</div>
                    <div className="font-bold text-teal-700 ltr">{(mixAnalysis.ndf / 10).toFixed(1)}%</div>
                    <div className="font-bold text-teal-700 ltr">{((mixAnalysis.ndf / 10) * dmFactor).toFixed(1)}%</div>
                </div>
                 <div className="text-xs text-slate-500 mt-3 text-center bg-white p-2 rounded-md">
                    نسبة المادة الجافة في الخلطة: <b className="ltr">{concentrateMixDMPercent.toFixed(1)}%</b>
                </div>
                <div className="font-medium text-slate-600 col-span-3 border-t pt-2 mt-3 text-sm">السعر التقديري:
                  <span className="font-bold text-slate-800 ltr text-right float-left">{mixPricePerKg.toFixed(2)} <span className="text-xs">/كغ رطب</span></span>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">2. كمية المركز المقدمة يومياً</h3>
                <label className="block text-sm font-medium text-slate-700 mb-2">الكمية (كغ رطب / يوميا)</label>
                <input
                    type="text"
                    inputMode="decimal"
                    lang="en"
                    value={concentrateFedAmount}
                    onChange={handleFedAmountChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-center"
                />
            </div>
        </div>
      </div>

      {/* Forage Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">3. إضافة الأعلاف المالئة (على أساس المادة الرطبة As Fed)</h2>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 rounded-r-lg">المادة العلفية</th>
                        <th className="px-4 py-3">الكمية (كغ/يومياً)</th>
                        <th className="px-4 py-3 rounded-l-lg text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {forageOptions.map(ing => (
                        <tr key={ing.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium text-slate-800">
                                <div>{ing.name}</div>
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    lang="en"
                                    value={forages.find(i => i.ingredientId === ing.id)?.amount || ''}
                                    onChange={(e) => updateForageItem(ing.id, e.target.value)}
                                    placeholder="0"
                                    className="w-24 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-center"
                                />
                            </td>
                            <td className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => handleEditIngredient(ing.id)} className="text-slate-400 hover:text-emerald-600 p-1" title="عرض التحليل وتعديل الخصائص">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDeleteIngredient(ing.id)} className="text-slate-400 hover:text-red-600 p-1" title="حذف المادة">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Total Ration Analysis Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">4. التحليل الكلي للعليقة اليومية</h2>
        {totalAsFed > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-center">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">المكون الغذائي</th>
                  <th className="px-4 py-3 border-l border-r font-semibold text-slate-600">على أساس الوزن الرطب</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">على أساس المادة الجافة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">الطاقة (Mcal/kg)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.me / totalAsFed).toFixed(2) : '0.00'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.me / totalDM).toFixed(2) : '0.00'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">البروتين الخام (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.cp / (totalAsFed * 10)).toFixed(1) : '0.0'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.cp / (totalDM * 10)).toFixed(1) : '0.0'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">الكالسيوم (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.ca / (totalAsFed * 10)).toFixed(2) : '0.00'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.ca / (totalDM * 10)).toFixed(2) : '0.00'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">الفوسفور (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.p / (totalAsFed * 10)).toFixed(2) : '0.00'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.p / (totalDM * 10)).toFixed(2) : '0.00'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">NDF (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.ndf / (totalAsFed * 10)).toFixed(1) : '0.0'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.ndf / (totalDM * 10)).toFixed(1) : '0.0'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">ADF (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.adf / (totalAsFed * 10)).toFixed(1) : '0.0'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.adf / (totalDM * 10)).toFixed(1) : '0.0'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">النشاء (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.starch / (totalAsFed * 10)).toFixed(1) : '0.0'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.starch / (totalDM * 10)).toFixed(1) : '0.0'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-right font-medium text-slate-800">السكر (%)</td>
                  <td className="px-4 py-2 border-l border-r ltr font-mono">{totalAsFed > 0 ? (supplied.sugar / (totalAsFed * 10)).toFixed(1) : '0.0'}</td>
                  <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{totalDM > 0 ? (supplied.sugar / (totalDM * 10)).toFixed(1) : '0.0'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">أضف كميات الأعلاف لعرض التحليل الكلي للعليقة.</p>
        )}
      </div>

      {/* Edit Ingredient Modal */}
      {isEditModalOpen && editingIngredient && (() => {
          const dmFactor = editingIngredient.dm > 0 ? 100 / editingIngredient.dm : 0;
          const analysisItems = [
              { key: 'me', label: 'الطاقة (Mcal/kg)', value: editingIngredient.me, precision: 2 },
              { key: 'cp', label: 'البروتين الخام (%)', value: editingIngredient.cp, precision: 1 },
              { key: 'ca', label: 'الكالسيوم (%)', value: editingIngredient.ca, precision: 2 },
              { key: 'p', label: 'الفوسفور (%)', value: editingIngredient.p, precision: 2 },
              { key: 'starch', label: 'النشاء (%)', value: editingIngredient.starch, precision: 1 },
              { key: 'sugar', label: 'السكر (%)', value: editingIngredient.sugar, precision: 1 },
              { key: 'ndf', label: 'NDF (%)', value: editingIngredient.ndf, precision: 1 },
              { key: 'adf', label: 'ADF (%)', value: editingIngredient.adf, precision: 1 },
          ];
          const nonAnalysisFields = [
              { key: 'name', label: 'الاسم', placeholder: editingIngredient.name, type: 'text', lang: 'ar' },
              { key: 'dm', label: 'المادة الجافة (%)', placeholder: editingIngredient.dm.toString(), type: 'decimal', lang: 'en' },
              { key: 'defaultPrice', label: 'السعر (للكغ)', placeholder: editingIngredient.defaultPrice.toString(), type: 'decimal', lang: 'en' },
          ];

          return (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-full overflow-y-auto animate-fade-in">
                      <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                          <h3 className="text-lg font-bold text-slate-800">تحليل وتعديل: {editingIngredient.name}</h3>
                          <button onClick={handleCloseEditModal} className="text-slate-400 hover:text-red-600">
                              <X className="w-6 h-6" />
                          </button>
                      </div>
                      <div className="p-6">
                          <h4 className="text-md font-bold text-slate-700 mb-3">التحليل الغذائي للمادة</h4>
                          <div className="overflow-x-auto rounded-lg border">
                              <table className="w-full text-sm text-center">
                                  <thead className="bg-slate-100">
                                      <tr>
                                          <th className="px-4 py-2 text-right font-semibold text-slate-600">المكون</th>
                                          <th className="px-4 py-2 border-l border-r font-semibold text-slate-600">على أساس الوزن الرطب</th>
                                          <th className="px-4 py-2 font-semibold text-slate-600">على أساس المادة الجافة</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {analysisItems.map(item => (
                                          <tr key={item.key} className="border-t">
                                              <td className="px-4 py-2 text-right font-medium text-slate-800">{item.label}</td>
                                              <td className="px-4 py-2 border-l border-r ltr font-mono">{item.value.toFixed(item.precision)}</td>
                                              <td className="px-4 py-2 ltr font-mono font-bold text-emerald-700">{(item.value * dmFactor).toFixed(item.precision)}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>

                          <h4 className="text-md font-bold text-slate-700 mb-3 pt-6 mt-6 border-t">تعديل القيم الأساسية (على أساس الوزن الرطب)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {nonAnalysisFields.map(field => (
                                  <div key={field.key}>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                                      <input
                                          type="text"
                                          inputMode={field.type === 'decimal' ? 'decimal' : 'text'}
                                          lang={field.lang}
                                          name={field.key}
                                          value={modalFormState[field.key] || ''}
                                          onChange={handleEditModalInputChange}
                                          className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none ${field.lang === 'en' ? 'ltr text-center' : 'text-right'}`}
                                          placeholder={field.placeholder}
                                      />
                                  </div>
                              ))}
                              {analysisItems.map(item => (
                                  <div key={item.key}>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">{item.label} (رطب)</label>
                                      <input
                                          type="text"
                                          inputMode="decimal"
                                          lang="en"
                                          name={item.key}
                                          value={modalFormState[item.key] || ''}
                                          onChange={handleEditModalInputChange}
                                          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none ltr text-center"
                                          placeholder={item.value.toString()}
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 sticky bottom-0 z-10">
                          <button onClick={handleCloseEditModal} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">إلغاء</button>
                          <button onClick={handleSaveIngredient} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1">
                              <Save className="w-4 h-4" />
                              حفظ التعديلات
                          </button>
                      </div>
                  </div>
              </div>
          );
      })()}
      
      {/* Add Ingredient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-bold text-slate-800">إضافة مادة علفية جديدة</h3>
                    <button onClick={handleCloseAddModal} className="text-slate-400 hover:text-red-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(initialNewIngredientFormState).map(key => {
                            const label = { name: 'الاسم', type: 'النوع', dm: 'المادة الجافة (%)', me: 'الطاقة (Mcal/kg رطب)', cp: 'البروتين الخام (% رطب)', ca: 'الكالسيوم (% رطب)', p: 'الفوسفور (% رطب)', starch: 'النشاء (% رطب)', sugar: 'السكر (% رطب)', ndf: 'NDF (% رطب)', adf: 'ADF (% رطب)', defaultPrice: 'السعر (للكغ)' }[key] || key;
                            
                            if (key === 'type') {
                                return (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                                        <select
                                            name={key}
                                            value={newIngredientFormState[key]}
                                            onChange={handleNewIngredientChange}
                                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                        >
                                            <option value="concentrate">مركز</option>
                                            <option value="forage">مالئ</option>
                                        </select>
                                    </div>
                                )
                            }

                            return (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                                    <input
                                        type={'text'}
                                        inputMode={key === 'name' ? 'text' : 'decimal'}
                                        lang="en"
                                        name={key}
                                        value={newIngredientFormState[key as keyof NewIngredientFormState]}
                                        onChange={handleNewIngredientChange}
                                        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none ${key === 'name' ? 'text-right' : 'ltr text-center'}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                     <div className="mt-4 bg-slate-50 p-3 text-xs text-slate-600 rounded-lg border">
                        <b>ملاحظة:</b> جميع قيم التحليل (طاقة، بروتين، ...) يجب إدخالها على أساس الوزن الرطب (As Fed) لضمان دقة الحسابات.
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 sticky bottom-0 z-10">
                    <button onClick={handleCloseAddModal} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
                        إلغاء
                    </button>
                    <button onClick={handleAddNewIngredient} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1">
                        <Save className="w-4 h-4" />
                        حفظ المادة
                    </button>
                </div>
            </div>
        </div>
      )}
      
      <IngredientVisibilityModal
        isOpen={isVisibilityModalOpen}
        onClose={() => setIsVisibilityModalOpen(false)}
        ingredients={ingredients}
        visibleIds={visibleIngredientIds}
        setVisibleIds={setVisibleIngredientIds}
      />
    </div>
  );
};

export default FeedForm;