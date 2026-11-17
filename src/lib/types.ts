export const CUISINES = [
  'Any',
  'American',
  'Mexican',
  'Italian',
  'Asian (any)',
  'Chinese',
  'Japanese',
  'Thai',
  'Korean',
  'Vietnamese',
  'Indian',
  'Mediterranean',
  'BBQ & Grill',
] as const;

export const CUISINE_EMOJI: Record<string, string> = {
  Any: '🍽️',
  American: '🍔',
  Mexican: '🌮',
  Italian: '🍝',
  'Asian (any)': '🥢',
  Chinese: '🥡',
  Japanese: '🍣',
  Thai: '🍜',
  Korean: '🍚',
  Vietnamese: '🍲',
  Indian: '🍛',
  Mediterranean: '🫒',
  'BBQ & Grill': '🍖',
};

export const MEAL_EMOJI: Record<string, string> = { Dinner: '🍝', Lunch: '🥪', Breakfast: '🥞' };

export const emojiFor = (cuisine: string) => CUISINE_EMOJI[cuisine] ?? '🍽️';

/** Cuisines that count as a match when the user picks "Asian (any)". */
export const ASIAN_CUISINES = ['Chinese', 'Japanese', 'Thai', 'Korean', 'Vietnamese', 'Indian'];

export const DIETS = ['Vegetarian', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Low-carb'] as const;
export type Diet = (typeof DIETS)[number];

export const MEAL_TYPES = ['Dinner', 'Lunch', 'Breakfast'] as const;
export const TIME_LIMITS = [20, 30, 45, 60, 0] as const; // 0 = no limit
export const BUDGETS = ['Budget', 'Moderate', 'Splurge'] as const;
export const EFFORTS = ['Easy', 'Medium', 'Ambitious'] as const;
export const SOURCES = ['Smart mix', 'New ideas only', 'Favorites only'] as const;

export type Prefs = {
  cuisine: string;
  mealType: string;
  days: number;
  people: number;
  kids: boolean;
  batchCook: boolean; // one big meal that covers all the days as leftovers
  maxMinutes: number; // 0 = no limit
  diets: Diet[];
  budget: string;
  effort: string;
  source: string;
  notes: string;
};

export type MealIdea = {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  minutes: number;
  kidFriendly: boolean;
  ingredients: string[];
  why?: string;
  fromFavorites?: boolean;
};

export type SavedMeal = {
  id: string;
  name: string;
  cuisine: string;
  photoUri?: string;
  notes: string;
  kidFriendly: boolean;
  recipeId?: string;
  timesMade: number;
  lastMade?: number;
  createdAt: number;
};

export type Recipe = {
  id: string;
  title: string;
  cuisine: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: string[];
  steps: string[];
  notes: string;
  photoUri?: string;
  source: 'manual' | 'ai';
  createdAt: number;
};

export type Rating = {
  name: string;
  cuisine: string;
  stars: number; // 1-5
  updatedAt: number;
};

export type Settings = {
  defaultPeople: number;
  hasKids: boolean;
  avoid: string; // comma-separated ingredients nobody eats
};

export const defaultPrefs = (s: Settings): Prefs => ({
  cuisine: 'Any',
  mealType: 'Dinner',
  days: 1,
  people: s.defaultPeople,
  kids: s.hasKids,
  batchCook: false,
  maxMinutes: 45,
  diets: [],
  budget: 'Moderate',
  effort: 'Easy',
  source: 'Smart mix',
  notes: '',
});

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/** Ratings and favorites are matched by name, so "Tacos " and "tacos" are the same meal. */
export const mealKey = (name: string) => name.trim().toLowerCase();
