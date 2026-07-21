import type { MealType } from '@/types/food';

export type MealPlanItem = {
  foodId: string;
  servings: number;
};

export type MealPlanMeal = {
  id: string;
  name: string;
  mealType: MealType;
  enabled: boolean;
  items: MealPlanItem[];
};

export type MealPlan = {
  id: string;
  name: string;
  meals: MealPlanMeal[];
};
