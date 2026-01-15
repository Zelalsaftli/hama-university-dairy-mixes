export interface CowParameters {
  weight: string; // kg
  milkProduction: string; // kg/day
  fatPercentage: string; // %
  proteinPercentage: string; // % (New: Required for NRC 2021 ECM)
  daysInMilk: string; // DIM (New: Required for NRC 2021 DMI)
  pregnancyMonth: number; // 0-9
  growthRate: number; // kg/day (heifers)
  bcsChange: number; // -1 to +1 (loss/gain)
  lactationStage: 'early' | 'mid' | 'late';
  environment: 'neutral' | 'heat_mild' | 'heat_severe' | 'cold';
  grazing: 'none' | 'flat' | 'hilly';
  // New Factors
  lactationNumber: number; // 1 (First calf), 2, or 3+ (Mature)
  breed: 'holstein' | 'jersey' | 'other';
}

export interface Nutrients {
  me: number; // Metabolizable Energy (Mcal)
  cp: number; // Crude Protein (g)
  ca: number; // Calcium (g)
  p: number; // Phosphorus (g)
  starch: number; // % DM (displayed) or g (calculated)
  sugar: number; // % DM or g
  ndf: number; // Neutral Detergent Fiber (g)
  adf: number; // Acid Detergent Fiber (g)
  predictedDmi?: number; // NRC 2021 Predicted Dry Matter Intake (kg)
}

export interface FeedIngredient {
  id: string;
  name: string;
  type: 'concentrate' | 'forage';
  dm: number; // Dry Matter %
  me: number; // Mcal/kg As Fed
  cp: number; // % As Fed
  ca: number; // % As Fed
  p: number; // % As Fed
  starch: number; // % As Fed
  sugar: number; // % As Fed
  ndf: number; // % As Fed
  adf: number; // % As Fed
  defaultPrice: number; // Price per kg
}

export interface RationItem {
  ingredientId: string;
  amount: string; // kg as fed
  isPercentage?: boolean; // For concentrate mix definition
}

export interface ConcentrateMix {
  ingredients: RationItem[];
  totalMixAmountFed: number; // kg fed to cow
}

export interface ForageRation {
  ingredients: RationItem[];
}

export enum Page {
  NEEDS = 'NEEDS',
  FEED = 'FEED',
  COMPARE = 'COMPARE',
  GUIDANCE = 'GUIDANCE',
}