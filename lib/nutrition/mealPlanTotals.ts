import { commonFoods } from '@/data/commonFoods';
import type {
  MealPlan,
  MealPlanMeal,
} from '@/types/mealPlan';

export type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type MealPlanMealSummary = {
  meal: MealPlanMeal;
  totals: MacroTotals;
};

const emptyTotals: MacroTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

export function getMealTotals(meal: MealPlanMeal): MacroTotals {
  if (!meal.enabled) {
    return { ...emptyTotals };
  }

  return meal.items.reduce<MacroTotals>((totals, item) => {
    const food = commonFoods.find(
      (currentFood) => currentFood.id === item.foodId,
    );

    if (!food) {
      return totals;
    }

    return {
      calories: totals.calories + food.calories * item.servings,
      protein: totals.protein + food.protein * item.servings,
      carbs: totals.carbs + food.carbs * item.servings,
      fat: totals.fat + food.fat * item.servings,
      fiber: totals.fiber + food.fiber * item.servings,
    };
  }, emptyTotals);
}

export function getMealPlanSummaries(
  mealPlan: MealPlan,
): MealPlanMealSummary[] {
  return mealPlan.meals.map((meal) => ({
    meal,
    totals: getMealTotals(meal),
  }));
}

export function getMealPlanTotals(
  mealPlan: MealPlan,
): MacroTotals {
  return mealPlan.meals.reduce<MacroTotals>((totals, meal) => {
    const mealTotals = getMealTotals(meal);

    return {
      calories: totals.calories + mealTotals.calories,
      protein: totals.protein + mealTotals.protein,
      carbs: totals.carbs + mealTotals.carbs,
      fat: totals.fat + mealTotals.fat,
      fiber: totals.fiber + mealTotals.fiber,
    };
  }, emptyTotals);
}
