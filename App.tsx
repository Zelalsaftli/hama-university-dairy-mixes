import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import NeedsForm from './components/NeedsForm';
import FeedForm from './components/FeedForm';
import Comparison from './components/Comparison';
import Guidance from './components/Guidance'; // Import the new component
import { CowParameters, Nutrients, RationItem, Page, FeedIngredient } from './types';
import { calculateRequirements, calculateSupplied } from './services/calculator';
import { FEED_DATABASE } from './constants';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.NEEDS);

  // State: Cow Parameters
  const initialCowParams: CowParameters = {
    weight: '',
    milkProduction: '',
    fatPercentage: '',
    proteinPercentage: '',
    daysInMilk: '',
    pregnancyMonth: 0,
    growthRate: 0,
    bcsChange: 0,
    lactationStage: 'mid',
    environment: 'neutral',
    grazing: 'none',
    // New Defaults
    lactationNumber: 3, // Mature by default
    breed: 'holstein'
  };
  const [cowParams, setCowParams] = useState<CowParameters>(initialCowParams);

  // State: Requirements (Calculated)
  const [needs, setNeeds] = useState<Nutrients>({ 
    me: 0, cp: 0, ca: 0, p: 0, 
    starch: 0, sugar: 0, ndf: 0, adf: 0,
    predictedDmi: 0
  });

  // State: Ingredients (Initialized from constant, but mutable)
  const [ingredients, setIngredients] = useState<FeedIngredient[]>(FEED_DATABASE);
  const [visibleIngredientIds, setVisibleIngredientIds] = useState<string[]>(() => FEED_DATABASE.map(i => i.id));


  // State: Feed
  const [concentrateMix, setConcentrateMix] = useState<RationItem[]>([]);
  const [concentrateFedAmount, setConcentrateFedAmount] = useState<string>('');
  const [forages, setForages] = useState<RationItem[]>([]);
  
  // State: Supplied (Calculated)
  const [supplied, setSupplied] = useState<Nutrients>({ 
    me: 0, cp: 0, ca: 0, p: 0,
    starch: 0, sugar: 0, ndf: 0, adf: 0
  });
  const [totalDM, setTotalDM] = useState<number>(0);
  const [totalAsFed, setTotalAsFed] = useState<number>(0);
  const [mixAnalysis, setMixAnalysis] = useState<Nutrients>({ 
    me: 0, cp: 0, ca: 0, p: 0,
    starch: 0, sugar: 0, ndf: 0, adf: 0
  });
  const [concentrateMixDMPercent, setConcentrateMixDMPercent] = useState<number>(0);
  const [rationStructure, setRationStructure] = useState<{ 
      concentrateDM: number; forageDM: number; concentratePercent: number; foragePercent: number; 
  }>({ concentrateDM: 0, forageDM: 0, concentratePercent: 0, foragePercent: 0 });

  // State: Cost
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleAddNewIngredient = (newIngredientData: Omit<FeedIngredient, 'id'>) => {
    const newIngredient: FeedIngredient = {
        id: `custom-${Date.now()}`,
        name: newIngredientData.name.trim(),
        type: newIngredientData.type,
        dm: Number(newIngredientData.dm) || 0,
        me: Number(newIngredientData.me) || 0,
        cp: Number(newIngredientData.cp) || 0,
        ca: Number(newIngredientData.ca) || 0,
        p: Number(newIngredientData.p) || 0,
        starch: Number(newIngredientData.starch) || 0,
        sugar: Number(newIngredientData.sugar) || 0,
        ndf: Number(newIngredientData.ndf) || 0,
        adf: Number(newIngredientData.adf) || 0,
        defaultPrice: Number(newIngredientData.defaultPrice) || 0,
    };
    setIngredients(prev => [...prev, newIngredient]);
    setVisibleIngredientIds(prev => [...prev, newIngredient.id]);
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    if (window.confirm(`هل أنت متأكد من حذف "${ingredient.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        setIngredients(prev => prev.filter(i => i.id !== ingredientId));
        setVisibleIngredientIds(prev => prev.filter(id => id !== ingredientId));
        setConcentrateMix(prev => prev.filter(i => i.ingredientId !== ingredientId));
        setForages(prev => prev.filter(i => i.ingredientId !== ingredientId));
    }
  };

  const handleReset = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في بدء جلسة جديدة؟ سيتم مسح جميع المدخلات.")) {
        setCowParams(initialCowParams);
        setConcentrateMix([]);
        setConcentrateFedAmount('');
        setForages([]);
        setIngredients(FEED_DATABASE);
        setVisibleIngredientIds(FEED_DATABASE.map(i => i.id));
        setActivePage(Page.NEEDS);
        window.scrollTo(0, 0);
    }
  };

  const handleSave = () => {
    const dataToSave = {
        cowParams,
        concentrateMix,
        concentrateFedAmount,
        forages,
        ingredients,
        visibleIngredientIds,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ration-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            try {
                const content = readerEvent.target?.result;
                if (typeof content !== 'string') {
                    throw new Error("File content is not a string.");
                }
                const loadedData = JSON.parse(content);

                // Basic validation
                if (!loadedData.cowParams || !loadedData.concentrateMix) {
                    throw new Error("Invalid ration file format.");
                }
                
                // Restore state
                setCowParams(loadedData.cowParams || initialCowParams);
                setConcentrateMix(loadedData.concentrateMix || []);
                setConcentrateFedAmount(loadedData.concentrateFedAmount || '');
                setForages(loadedData.forages || []);
                setIngredients(loadedData.ingredients || FEED_DATABASE);
                setVisibleIngredientIds(loadedData.visibleIngredientIds || FEED_DATABASE.map(i => i.id));

                alert('تم تحميل العليقة بنجاح!');
                setActivePage(Page.NEEDS);
            } catch (error) {
                console.error("Failed to load or parse file:", error);
                alert('فشل في تحميل الملف. تأكد من أنه ملف عليقة صالح.');
            }
        };
        reader.onerror = () => {
            console.error("Error reading file");
            alert('حدث خطأ أثناء قراءة الملف.');
        }
        reader.readAsText(file);
    };
    input.click();
  };

  // Effects to trigger calculations
  useEffect(() => {
    const calculated = calculateRequirements(cowParams);
    setNeeds(calculated);
  }, [cowParams]);

  useEffect(() => {
    const result = calculateSupplied(concentrateMix, concentrateFedAmount, forages, ingredients);
    setSupplied(result);
    setTotalDM(result.totalDM);
    setTotalAsFed(result.totalAsFed);
    setMixAnalysis(result.concentrateAnalysis);
    setRationStructure(result.rationStructure);
    setConcentrateMixDMPercent(result.concentrateMixDMPercent);

    // Calculate Costs
    let mixPricePerKgAsFed = 0;
    const totalMixParts = concentrateMix.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    if (totalMixParts > 0) {
        let totalCostOfMix = 0;
        let totalAsFedWeightOfMix = 0;

        // Mix is always As Fed now
        totalAsFedWeightOfMix = totalMixParts;
        totalCostOfMix = concentrateMix.reduce((sum, item) => {
            const ing = ingredients.find(i => i.id === item.ingredientId);
            const itemAmount = parseFloat(item.amount) || 0;
            return sum + (itemAmount * (ing?.defaultPrice || 0));
        }, 0);
        
        if (totalAsFedWeightOfMix > 0) {
            mixPricePerKgAsFed = totalCostOfMix / totalAsFedWeightOfMix;
        }
    }

    let dailyCost = 0;
    const parsedConcentrateFedAmount = parseFloat(concentrateFedAmount) || 0;
    dailyCost += mixPricePerKgAsFed * parsedConcentrateFedAmount;
    
    forages.forEach(f => {
        const ing = ingredients.find(i => i.id === f.ingredientId);
        dailyCost += (parseFloat(f.amount) || 0) * (ing?.defaultPrice || 0);
    });

    setTotalCost(dailyCost);

  }, [concentrateMix, concentrateFedAmount, forages, ingredients]);

  return (
    <Layout 
        activePage={activePage} 
        setPage={setActivePage} 
        onReset={handleReset} 
        onSave={handleSave}
        onLoad={handleLoad}
    >
      {activePage === Page.NEEDS && (
        <NeedsForm 
            params={cowParams} 
            setParams={setCowParams} 
            calculatedNeeds={needs} 
        />
      )}
      
      {activePage === Page.FEED && (
        <FeedForm 
            concentrateMix={concentrateMix}
            setConcentrateMix={setConcentrateMix}
            concentrateFedAmount={concentrateFedAmount}
            setConcentrateFedAmount={setConcentrateFedAmount}
            forages={forages}
            setForages={setForages}
            mixAnalysis={mixAnalysis}
            concentrateMixDMPercent={concentrateMixDMPercent}
            ingredients={ingredients}
            onAddNewIngredient={handleAddNewIngredient}
            onDeleteIngredient={handleDeleteIngredient}
            visibleIngredientIds={visibleIngredientIds}
            setVisibleIngredientIds={setVisibleIngredientIds}
            supplied={supplied}
            totalDM={totalDM}
            totalAsFed={totalAsFed}
        />
      )}

      {activePage === Page.COMPARE && (
        <Comparison 
            needs={needs}
            supplied={supplied}
            totalDM={totalDM}
            totalCost={totalCost}
            milkProduction={parseFloat(cowParams.milkProduction) || 0}
            rationStructure={rationStructure}
        />
      )}

      {activePage === Page.GUIDANCE && (
        <Guidance />
      )}

    </Layout>
  );
};

export default App;