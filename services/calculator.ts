import { CowParameters, Nutrients, RationItem, FeedIngredient } from '../types';

export const calculateRequirements = (params: CowParameters): Nutrients => {
  const weight = parseFloat(params.weight) || 0;
  const daysInMilk = parseFloat(params.daysInMilk) || 0;
  const isHeifer = params.lactationNumber === 0;

  let me = 0;
  let cp = 0;
  let ca = 0;
  let p = 0;

  const w075 = Math.pow(weight, 0.75);

  // 1. Maintenance (NRC 2021 Adaptation) - Common for all
  let meMaintCoeff = 0.14; 
  if (params.breed === 'jersey') meMaintCoeff *= 1.15;
  if (params.environment === 'heat_mild') meMaintCoeff *= 1.10; 
  else if (params.environment === 'heat_severe') meMaintCoeff *= 1.25; 
  else if (params.environment === 'cold') meMaintCoeff *= 1.15; 

  let activityFactor = 1.0;
  if (params.grazing === 'flat') activityFactor = 1.15;
  else if (params.grazing === 'hilly') activityFactor = 1.30;
  
  const meMaint = (meMaintCoeff * w075) * activityFactor;
  const cpMaint = (4.1 * w075) * activityFactor; 
  const caMaint = 0.0154 * weight;
  const pMaint = 0.0125 * weight;

  me += meMaint;
  cp += cpMaint;
  ca += caMaint;
  p += pMaint;

  // 2. Pregnancy (Common for all)
  if (params.pregnancyMonth > 6) {
    const pregFactor = (params.pregnancyMonth - 6);
    me += 1.8 * pregFactor; 
    cp += 110 * pregFactor;
    ca += 10 * pregFactor;
    p += 6 * pregFactor;
  }
  
  let growthRateToUse = params.growthRate;

  if (isHeifer) {
    // --- HEIFER CALCULATION ---
    if (growthRateToUse > 0) {
       me += 5 * growthRateToUse; 
       cp += 300 * growthRateToUse;
       ca += 25 * growthRateToUse;
       p += 15 * growthRateToUse;
    }

    const predictedDmi = weight > 0 ? weight * 0.022 : 0; // Approx 2.2% of BW for DMI

    const estimatedDMI = predictedDmi > 0 ? predictedDmi : 0;
    const ndfReq = estimatedDMI * 1000 * 0.35; // Heifers need sufficient fiber
    const adfReq = estimatedDMI * 1000 * 0.23;
    const starchMax = estimatedDMI * 1000 * 0.22; // Lower starch to avoid issues
    const sugarReq = estimatedDMI * 1000 * 0.05;

    return {
      me: parseFloat(me.toFixed(2)),
      cp: Math.round(cp),
      ca: Math.round(ca),
      p: Math.round(p),
      ndf: Math.round(ndfReq),
      adf: Math.round(adfReq),
      starch: Math.round(starchMax),
      sugar: Math.round(sugarReq),
      predictedDmi: parseFloat(estimatedDMI.toFixed(1))
    };

  } else {
    // --- LACTATING COW CALCULATION ---
    const milkProduction = parseFloat(params.milkProduction) || 0;
    const fatPercentage = parseFloat(params.fatPercentage) || 0;
    const proteinPercentage = parseFloat(params.proteinPercentage) || 0;

    // 3. Milk Production
    const nelPerKgMilk = 0.36 + (0.096 * fatPercentage);
    const mePerKgMilk = nelPerKgMilk / 0.64; 
    me += milkProduction * mePerKgMilk;
    cp += milkProduction * 90; 
    ca += milkProduction * 1.22;
    p += milkProduction * 0.9;

    // 4. Growth for Lactating Cows
    if (growthRateToUse === 0) {
        if (params.lactationNumber === 1) growthRateToUse = 0.5;
        if (params.lactationNumber === 2) growthRateToUse = 0.2;
    }
    if (growthRateToUse > 0) {
       me += 5 * growthRateToUse; 
       cp += 300 * growthRateToUse;
       ca += 25 * growthRateToUse;
       p += 15 * growthRateToUse;
    }

    // 5. Body Condition Change
    if (params.bcsChange > 0) {
        me += 6.0 * params.bcsChange; 
        cp += 60 * params.bcsChange; 
    } else if (params.bcsChange < 0) {
        me += 4.9 * params.bcsChange; 
    }

    // DMI Calculation for Lactating Cows
    const milkKg = milkProduction;
    const fatKg = milkKg * (fatPercentage / 100);
    const proteinKg = milkKg * (proteinPercentage / 100);
    const ecm = (0.327 * milkKg) + (12.95 * fatKg) + (7.2 * proteinKg);
    const wol = daysInMilk / 7;
    let predictedDmi = 3.75 + (0.012 * weight) + (0.285 * ecm);
    if (params.lactationNumber === 1) predictedDmi *= 0.94;
    const lagFactor = 1 - Math.exp(-0.192 * (wol + 3.67));
    predictedDmi *= lagFactor;
    if (params.environment === 'heat_mild') predictedDmi *= 0.92;
    if (params.environment === 'heat_severe') predictedDmi *= 0.85;

    const estimatedDMI = predictedDmi > 0 ? predictedDmi : 0;
    
    // Dynamic starch and sugar targets based on lactation stage.
    let starchPercent = 0.25; // Default for mid-lactation (100-200 DIM)
    if (daysInMilk > 0 && daysInMilk < 100) {
        starchPercent = 0.27; // Early lactation
    } else if (daysInMilk > 200) {
        starchPercent = 0.22; // Late lactation
    }

    const sugarPercent = 0.06;

    const ndfReq = estimatedDMI * 1000 * 0.30;
    const adfReq = estimatedDMI * 1000 * 0.21;
    const starchMax = estimatedDMI * 1000 * starchPercent;
    const sugarReq = estimatedDMI * 1000 * sugarPercent;

    return {
      me: parseFloat(me.toFixed(2)),
      cp: Math.round(cp),
      ca: Math.round(ca),
      p: Math.round(p),
      ndf: Math.round(ndfReq),
      adf: Math.round(adfReq),
      starch: Math.round(starchMax), 
      sugar: Math.round(sugarReq),
      predictedDmi: parseFloat(estimatedDMI.toFixed(1))
    };
  }
};

export const calculateSupplied = (
  concentrateMix: RationItem[], 
  concentrateAmountFed: string, 
  forages: RationItem[],
  feedDatabase: FeedIngredient[]
): Nutrients & { 
    totalDM: number;
    totalAsFed: number;
    concentrateAnalysis: Nutrients; // As Fed
    concentrateMixDMPercent: number; // As percentage
    rationStructure: { concentrateDM: number; forageDM: number; concentratePercent: number; foragePercent: number }
} => {
  
  let totalME = 0;
  let totalCP = 0;
  let totalCa = 0;
  let totalP = 0;
  let totalStarch = 0;
  let totalSugar = 0;
  let totalNDF = 0;
  let totalADF = 0;
  let totalDM = 0;
  let totalAsFed = 0;

  // 1. Calculate Concentrate Mix Analysis (per kg AS-FED)
  let mixNutrientTotals = { me: 0, cp: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, dm: 0 };
  let mixTotalAsFedParts = 0;

  concentrateMix.forEach(item => {
      const feed = feedDatabase.find(f => f.id === item.ingredientId);
      if (feed) {
          const itemAsFedAmount = parseFloat(item.amount) || 0;
          mixTotalAsFedParts += itemAsFedAmount;
          
          mixNutrientTotals.me += itemAsFedAmount * feed.me;
          mixNutrientTotals.cp += itemAsFedAmount * (feed.cp / 100) * 1000;
          mixNutrientTotals.ca += itemAsFedAmount * (feed.ca / 100) * 1000;
          mixNutrientTotals.p += itemAsFedAmount * (feed.p / 100) * 1000;
          mixNutrientTotals.starch += itemAsFedAmount * (feed.starch / 100) * 1000;
          mixNutrientTotals.sugar += itemAsFedAmount * (feed.sugar / 100) * 1000;
          mixNutrientTotals.ndf += itemAsFedAmount * (feed.ndf / 100) * 1000;
          mixNutrientTotals.adf += itemAsFedAmount * (feed.adf / 100) * 1000;
          mixNutrientTotals.dm += itemAsFedAmount * (feed.dm / 100);
      }
  });
  
  const concentrateAnalysis: Nutrients = { me: 0, cp: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0 };
  let concentrateMixDMPercentFraction = 0;

  if (mixTotalAsFedParts > 0) {
      concentrateAnalysis.me = mixNutrientTotals.me / mixTotalAsFedParts;
      concentrateAnalysis.cp = mixNutrientTotals.cp / mixTotalAsFedParts; // g / kg As Fed
      concentrateAnalysis.ca = mixNutrientTotals.ca / mixTotalAsFedParts;
      concentrateAnalysis.p = mixNutrientTotals.p / mixTotalAsFedParts;
      concentrateAnalysis.starch = mixNutrientTotals.starch / mixTotalAsFedParts;
      concentrateAnalysis.sugar = mixNutrientTotals.sugar / mixTotalAsFedParts;
      concentrateAnalysis.ndf = mixNutrientTotals.ndf / mixTotalAsFedParts;
      concentrateAnalysis.adf = mixNutrientTotals.adf / mixTotalAsFedParts;
      concentrateMixDMPercentFraction = mixNutrientTotals.dm / mixTotalAsFedParts;
  }
  
  // 2. Calculate nutrients supplied by the amount of concentrate mix fed
  const parsedConcentrateAmountFed = parseFloat(concentrateAmountFed) || 0;
  totalAsFed += parsedConcentrateAmountFed;

  let concentrateDM = 0;
  if (parsedConcentrateAmountFed > 0) {
      totalME += concentrateAnalysis.me * parsedConcentrateAmountFed;
      totalCP += concentrateAnalysis.cp * parsedConcentrateAmountFed;
      totalCa += concentrateAnalysis.ca * parsedConcentrateAmountFed;
      totalP += concentrateAnalysis.p * parsedConcentrateAmountFed;
      totalStarch += concentrateAnalysis.starch * parsedConcentrateAmountFed;
      totalSugar += concentrateAnalysis.sugar * parsedConcentrateAmountFed;
      totalNDF += concentrateAnalysis.ndf * parsedConcentrateAmountFed;
      totalADF += concentrateAnalysis.adf * parsedConcentrateAmountFed;
      concentrateDM = parsedConcentrateAmountFed * concentrateMixDMPercentFraction;
  }

  // 3. Calculate nutrients supplied by forages
  let forageDM = 0;
  forages.forEach(item => {
      const feed = feedDatabase.find(f => f.id === item.ingredientId);
      if (feed) {
          const asFedAmount = parseFloat(item.amount) || 0;
          totalAsFed += asFedAmount;
          forageDM += asFedAmount * (feed.dm / 100);
          
          totalME += asFedAmount * feed.me;
          totalCP += asFedAmount * (feed.cp / 100) * 1000;
          totalCa += asFedAmount * (feed.ca / 100) * 1000;
          totalP += asFedAmount * (feed.p / 100) * 1000;
          totalStarch += asFedAmount * (feed.starch / 100) * 1000;
          totalSugar += asFedAmount * (feed.sugar / 100) * 1000;
          totalNDF += asFedAmount * (feed.ndf / 100) * 1000;
          totalADF += asFedAmount * (feed.adf / 100) * 1000;
      }
  });

  totalDM = concentrateDM + forageDM;
  
  const rationStructure = {
      concentrateDM,
      forageDM,
      concentratePercent: totalDM > 0 ? parseFloat(((concentrateDM / totalDM) * 100).toFixed(1)) : 0,
      foragePercent: totalDM > 0 ? parseFloat(((forageDM / totalDM) * 100).toFixed(1)) : 0,
  };

  return {
    me: parseFloat(totalME.toFixed(2)),
    cp: Math.round(totalCP),
    ca: Math.round(totalCa),
    p: Math.round(totalP),
    starch: Math.round(totalStarch),
    sugar: Math.round(totalSugar),
    ndf: Math.round(totalNDF),
    adf: Math.round(totalADF),
    totalDM: parseFloat(totalDM.toFixed(2)),
    totalAsFed: parseFloat(totalAsFed.toFixed(2)),
    concentrateAnalysis,
    concentrateMixDMPercent: concentrateMixDMPercentFraction * 100,
    rationStructure
  };
};