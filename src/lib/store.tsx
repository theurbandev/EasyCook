import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { deletePhoto } from './photos';
import {
  defaultPrefs,
  mealKey,
  newId,
  type MealIdea,
  type Prefs,
  type Rating,
  type Recipe,
  type SavedMeal,
  type Settings,
} from './types';

const STORAGE_KEY = 'easycook:v1';

type State = {
  meals: SavedMeal[];
  recipes: Recipe[];
  ratings: Record<string, Rating>;
  settings: Settings;
  lastPrefs?: Prefs;
  lastIdeas: MealIdea[];
};

const initialState: State = {
  meals: [],
  recipes: [],
  ratings: {},
  settings: { defaultPeople: 4, hasKids: true, avoid: '' },
  lastIdeas: [],
};

type Store = State & {
  ready: boolean;
  rate: (name: string, cuisine: string, stars: number) => void;
  starsFor: (name: string) => number;
  saveMeal: (meal: Omit<SavedMeal, 'id' | 'createdAt' | 'timesMade'> & Partial<SavedMeal>) => SavedMeal;
  updateMeal: (id: string, patch: Partial<SavedMeal>) => void;
  deleteMeal: (id: string) => void;
  markMade: (id: string) => void;
  saveRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'> & { id?: string }) => Recipe;
  deleteRecipe: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setPlan: (prefs: Prefs, ideas: MealIdea[]) => void;
  replaceIdea: (id: string, idea: MealIdea) => void;
  prefs: Prefs;
  resetAll: () => Promise<void>;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const rate = useCallback((name: string, cuisine: string, stars: number) => {
    setState((s) => ({
      ...s,
      ratings: { ...s.ratings, [mealKey(name)]: { name: name.trim(), cuisine, stars, updatedAt: Date.now() } },
    }));
  }, []);

  const starsFor = useCallback((name: string) => state.ratings[mealKey(name)]?.stars ?? 0, [state.ratings]);

  const saveMeal: Store['saveMeal'] = useCallback((meal) => {
    const saved: SavedMeal = { timesMade: 0, createdAt: Date.now(), ...meal, id: meal.id ?? newId() };
    setState((s) => ({ ...s, meals: [saved, ...s.meals.filter((m) => m.id !== saved.id)] }));
    return saved;
  }, []);

  const updateMeal = useCallback((id: string, patch: Partial<SavedMeal>) => {
    setState((s) => ({ ...s, meals: s.meals.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setState((s) => {
      const meal = s.meals.find((m) => m.id === id);
      if (meal?.photoUri) deletePhoto(meal.photoUri);
      return { ...s, meals: s.meals.filter((m) => m.id !== id) };
    });
  }, []);

  const markMade = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      meals: s.meals.map((m) => (m.id === id ? { ...m, timesMade: m.timesMade + 1, lastMade: Date.now() } : m)),
    }));
  }, []);

  const saveRecipe: Store['saveRecipe'] = useCallback((recipe) => {
    const saved: Recipe = { createdAt: Date.now(), ...recipe, id: recipe.id ?? newId() };
    setState((s) => ({ ...s, recipes: [saved, ...s.recipes.filter((r) => r.id !== saved.id)] }));
    return saved;
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setState((s) => {
      const recipe = s.recipes.find((r) => r.id === id);
      if (recipe?.photoUri) deletePhoto(recipe.photoUri);
      return {
      ...s,
      recipes: s.recipes.filter((r) => r.id !== id),
      meals: s.meals.map((m) => (m.recipeId === id ? { ...m, recipeId: undefined } : m)),
      };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const setPlan = useCallback((prefs: Prefs, ideas: MealIdea[]) => {
    setState((s) => ({ ...s, lastPrefs: prefs, lastIdeas: ideas }));
  }, []);

  const replaceIdea = useCallback((id: string, idea: MealIdea) => {
    setState((s) => ({ ...s, lastIdeas: s.lastIdeas.map((i) => (i.id === id ? idea : i)) }));
  }, []);

  const resetAll = useCallback(async () => {
    [...state.meals, ...state.recipes].forEach((item) => item.photoUri && deletePhoto(item.photoUri));
    setState(initialState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, [state.meals, state.recipes]);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      prefs: state.lastPrefs ?? defaultPrefs(state.settings),
      rate,
      starsFor,
      saveMeal,
      updateMeal,
      deleteMeal,
      markMade,
      saveRecipe,
      deleteRecipe,
      updateSettings,
      setPlan,
      replaceIdea,
      resetAll,
    }),
    [state, ready, rate, starsFor, saveMeal, updateMeal, deleteMeal, markMade, saveRecipe, deleteRecipe, updateSettings, setPlan, replaceIdea, resetAll],
  );

  // Wait for saved data so screens start from the family's real settings.
  if (!ready) return null;
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
