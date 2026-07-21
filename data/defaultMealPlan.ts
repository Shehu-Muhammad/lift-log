import type { MealPlan } from '@/types/mealPlan';

export const defaultMealPlan: MealPlan = {
  id: 'default-daily-plan',
  name: 'Default Daily Meal Plan',
  meals: [
    {
      id: 'breakfast',
      name: 'Breakfast',
      mealType: 'breakfast',
      enabled: true,
      items: [
        {
          foodId: 'whole-egg',
          servings: 3,
        },
        {
          foodId: 'egg-whites',
          servings: 1,
        },
        {
          foodId: 'oikos-yogurt',
          servings: 1,
        },
        {
          foodId: 'banana',
          servings: 1,
        },
      ],
    },
    {
      id: 'lunch',
      name: 'Lunch',
      mealType: 'lunch',
      enabled: true,
      items: [
        {
          foodId: 'chicken-tenderloins',
          servings: 2,
        },
        {
          foodId: 'white-rice',
          servings: 1.5,
        },
        {
          foodId: 'broccoli',
          servings: 1,
        },
      ],
    },
    {
      id: 'dinner',
      name: 'Dinner',
      mealType: 'dinner',
      enabled: true,
      items: [
        {
          foodId: 'salmon',
          servings: 1.5,
        },
        {
          foodId: 'white-rice',
          servings: 1,
        },
        {
          foodId: 'broccoli',
          servings: 1,
        },
      ],
    },
    {
      id: 'snack',
      name: 'Snack',
      mealType: 'snack',
      enabled: true,
      items: [
        {
          foodId: 'whey-isolate',
          servings: 1,
        },
        {
          foodId: 'pink-lady-apple',
          servings: 1,
        },
      ],
    },
  ],
};
