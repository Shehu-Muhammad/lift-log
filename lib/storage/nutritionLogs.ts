import type {
  DailyNutritionLog,
  MacroGoals,
} from '@/types/nutrition';

const NUTRITION_LOGS_KEY = 'liftlog-nutrition-logs';
const MACRO_GOALS_KEY = 'liftlog-macro-goals';

export function getNutritionLogs(): DailyNutritionLog[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedLogs = window.localStorage.getItem(NUTRITION_LOGS_KEY);

  if (!storedLogs) {
    return [];
  }

  try {
    return JSON.parse(storedLogs) as DailyNutritionLog[];
  } catch {
    return [];
  }
}

export function saveNutritionLog(log: DailyNutritionLog): void {
  const currentLogs = getNutritionLogs();

  const updatedLogs = [
    log,
    ...currentLogs.filter((item) => item.date !== log.date),
  ];

  window.localStorage.setItem(
    NUTRITION_LOGS_KEY,
    JSON.stringify(updatedLogs),
  );
}

export function getMacroGoals(): MacroGoals {
  if (typeof window === 'undefined') {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  const storedGoals = window.localStorage.getItem(MACRO_GOALS_KEY);

  if (!storedGoals) {
    return {
      calories: 2400,
      protein: 200,
      carbs: 250,
      fat: 70,
      fiber: 30,
    };
  }

  try {
    return JSON.parse(storedGoals) as MacroGoals;
  } catch {
    return {
      calories: 2400,
      protein: 200,
      carbs: 250,
      fat: 70,
      fiber: 30,
    };
  }
}

export function saveMacroGoals(goals: MacroGoals): void {
  window.localStorage.setItem(
    MACRO_GOALS_KEY,
    JSON.stringify(goals),
  );
}
