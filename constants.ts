import { FeedIngredient } from './types';

// Simplified nutritional values. IMPORTANT: All nutrient values (ME, CP, etc.) are now assumed to be on an AS-FED basis.
export const FEED_DATABASE: FeedIngredient[] = [
  // Concentrates - Values are per kg AS FED
  { id: 'c_barley', name: 'شعير', type: 'concentrate', dm: 88, me: 2.64, cp: 10.6, ca: 0.05, p: 0.33, starch: 48.4, sugar: 2.2, ndf: 16.7, adf: 6.2, defaultPrice: 1.2 },
  { id: 'c_corn', name: 'ذرة صفراء', type: 'concentrate', dm: 88, me: 2.73, cp: 7.9, ca: 0.03, p: 0.26, starch: 61.6, sugar: 1.3, ndf: 7.9, adf: 2.6, defaultPrice: 0.35 },
  { id: 'c_wheat', name: 'قمح', type: 'concentrate', dm: 88, me: 2.64, cp: 11.4, ca: 0.04, p: 0.35, starch: 52.8, sugar: 2.2, ndf: 10.6, adf: 3.5, defaultPrice: 0.35 },
  { id: 'c_bran', name: 'نخالة قمح', type: 'concentrate', dm: 88, me: 2.29, cp: 14.1, ca: 0.12, p: 0.97, starch: 17.6, sugar: 4.4, ndf: 35.2, adf: 10.6, defaultPrice: 0.2 },
  { id: 'c_soy44', name: 'كسبة صويا 44%', type: 'concentrate', dm: 90, me: 2.72, cp: 44.0, ca: 0.27, p: 0.59, starch: 3.6, sugar: 6.3, ndf: 12.6, adf: 8.1, defaultPrice: 0.5 },
  { id: 'c_cotton', name: 'كسبة قطن (غير مقشور)', type: 'concentrate', dm: 90, me: 2.16, cp: 21.6, ca: 0.18, p: 0.54, starch: 0.9, sugar: 2.7, ndf: 40.5, adf: 31.5, defaultPrice: 0.4 },
  { id: 'c_beet', name: 'تفل شوندر جاف', type: 'concentrate', dm: 90, me: 2.34, cp: 8.1, ca: 0.72, p: 0.09, starch: 0.9, sugar: 5.4, ndf: 36, adf: 19.8, defaultPrice: 0.35 },
  { id: 'c_salt', name: 'ملح طعام', type: 'concentrate', dm: 100, me: 0, cp: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 0.1 },
  { id: 'c_limestone', name: 'حجر جيري', type: 'concentrate', dm: 100, me: 0, cp: 0, ca: 38, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 0.04 },
  { id: 'c_dcp', name: 'ديكالسيوم فوسفات', type: 'concentrate', dm: 100, me: 0, cp: 0, ca: 22, p: 19, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 0.98 },
  { id: 'c_vit', name: 'بريمكس فيتامين', type: 'concentrate', dm: 100, me: 0, cp: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 8 },
  { id: 'c_min', name: 'بريمكس معادن', type: 'concentrate', dm: 100, me: 0, cp: 0, ca: 0, p: 0, starch: 0, sugar: 0, ndf: 0, adf: 0, defaultPrice: 6 },

  // Forages - Values are per kg AS FED
  { id: 'f_wstraw', name: 'قش قمح', type: 'forage', dm: 90, me: 1.44, cp: 3.15, ca: 0.18, p: 0.09, starch: 0.9, sugar: 0.9, ndf: 67.5, adf: 45, defaultPrice: 0.3 },
  { id: 'f_bstraw', name: 'قش شعير', type: 'forage', dm: 90, me: 1.53, cp: 3.6, ca: 0.22, p: 0.09, starch: 0.9, sugar: 0.9, ndf: 64.8, adf: 43.2, defaultPrice: 0.35 },
  { id: 'f_lstraw', name: 'قش بقولي', type: 'forage', dm: 90, me: 1.71, cp: 6.3, ca: 0.9, p: 0.13, starch: 0.9, sugar: 0.9, ndf: 54, adf: 40.5, defaultPrice: 0.5 },
  { id: 'f_lhay', name: 'دريس بقولي (فصة)', type: 'forage', dm: 85, me: 1.96, cp: 15.3, ca: 1.19, p: 0.21, starch: 1.7, sugar: 3.4, ndf: 34, adf: 25.5, defaultPrice: 1.8 },
  { id: 'f_ghay', name: 'دريس نجيلي', type: 'forage', dm: 85, me: 1.79, cp: 8.5, ca: 0.43, p: 0.21, starch: 1.7, sugar: 5.1, ndf: 55.25, adf: 29.75, defaultPrice: 1.2 },
  { id: 'f_silage', name: 'سيلاج ذرة', type: 'forage', dm: 35, me: 0.91, cp: 2.8, ca: 0.09, p: 0.07, starch: 10.5, sugar: 0.35, ndf: 15.75, adf: 9.8, defaultPrice: 0.45 },
];