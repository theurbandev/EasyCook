import { generateIdeas, type FamilyContext } from './ai';
import { MEAL_LIBRARY, type LibraryMeal } from './mealLibrary';
import { ASIAN_CUISINES, BUDGETS, EFFORTS, mealKey, newId, type MealIdea, type Prefs, type Rating, type SavedMeal } from './types';

export type GenerateInput = {
  prefs: Prefs;
  ratings: Record<string, Rating>;
  meals: SavedMeal[];
  avoid: string;
  apiKey: string | null;
  exclude?: string[]; // names already on screen (used when swapping one idea)
  count?: number;
};

const cuisineMatches = (wanted: string, actual: string) =>
  wanted === 'Any' ||
  wanted.toLowerCase() === actual.toLowerCase() ||
  (wanted === 'Asian (any)' && ASIAN_CUISINES.includes(actual));

const avoidList = (avoid: string) =>
  avoid
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

export function familyContext(ratings: Record<string, Rating>, meals: SavedMeal[], avoid: string): FamilyContext {
  const all = Object.values(ratings);
  return {
    loved: all.filter((r) => r.stars >= 4).map((r) => r.name).slice(0, 30),
    disliked: all.filter((r) => r.stars > 0 && r.stars <= 2).map((r) => r.name).slice(0, 30),
    gallery: meals.map((m) => m.name).slice(0, 30),
    avoid,
  };
}

/** Weighted random pick: higher weight = more likely, without repeats. */
function weightedPick<T>(items: { item: T; weight: number }[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length) {
    const total = pool.reduce((sum, p) => sum + p.weight, 0);
    let r = Math.random() * total;
    const idx = pool.findIndex((p) => (r -= p.weight) <= 0);
    picked.push(pool.splice(idx === -1 ? pool.length - 1 : idx, 1)[0].item);
  }
  return picked;
}

// Unrated meals get weight 3; each star above/below 3 shifts the odds.
const weightFor = (stars: number | undefined) => (stars ? [0, 0, 0.5, 3, 6, 9][stars] : 3);

function libraryIdeas(input: GenerateInput, count: number, exclude: Set<string>): MealIdea[] {
  const { prefs, ratings } = input;
  const avoid = avoidList(input.avoid);
  const budget = BUDGETS.indexOf(prefs.budget as (typeof BUDGETS)[number]) + 1;
  const effort = EFFORTS.indexOf(prefs.effort as (typeof EFFORTS)[number]) + 1;

  const hardOk = (m: LibraryMeal) =>
    cuisineMatches(prefs.cuisine, m.cuisine) &&
    m.mealTypes.includes(prefs.mealType) &&
    prefs.diets.every((d) => m.diets.includes(d)) &&
    !m.ingredients.some((i) => avoid.some((a) => i.toLowerCase().includes(a))) &&
    !exclude.has(mealKey(m.name)) &&
    (ratings[mealKey(m.name)]?.stars ?? 3) > 2;

  // Soft filters are dropped one at a time if they leave too few options.
  const soft: ((m: LibraryMeal) => boolean)[] = [
    (m) => !prefs.batchCook || m.batchFriendly,
    (m) => !prefs.kids || m.kidFriendly,
    (m) => !prefs.maxMinutes || m.minutes <= prefs.maxMinutes,
    (m) => m.effort <= Math.max(effort, 1),
    (m) => m.budget <= Math.max(budget, 1),
  ];

  const base = MEAL_LIBRARY.filter(hardOk);
  let candidates = base.filter((m) => soft.every((f) => f(m)));
  for (let drop = soft.length - 1; candidates.length < count && drop >= 0; drop--) {
    candidates = base.filter((m) => soft.slice(0, drop).every((f) => f(m)));
  }

  return weightedPick(
    candidates.map((m) => ({ item: m, weight: weightFor(ratings[mealKey(m.name)]?.stars) })),
    count,
  ).map((m) => {
    const stars = ratings[mealKey(m.name)]?.stars;
    return {
      id: newId(),
      name: m.name,
      cuisine: m.cuisine,
      description: m.description,
      minutes: m.minutes,
      kidFriendly: m.kidFriendly,
      ingredients: m.ingredients,
      why: stars && stars >= 4 ? `You rated this ${stars} stars` : undefined,
    };
  });
}

function favoriteIdeas(input: GenerateInput, count: number, exclude: Set<string>): MealIdea[] {
  const { prefs, ratings, meals } = input;
  const candidates = meals.filter(
    (m) =>
      cuisineMatches(prefs.cuisine, m.cuisine) &&
      (!prefs.kids || m.kidFriendly) &&
      !exclude.has(mealKey(m.name)) &&
      (ratings[mealKey(m.name)]?.stars ?? 3) > 2,
  );
  // Meals not made recently get a boost so favorites rotate.
  const weeksSince = (m: SavedMeal) => (m.lastMade ? (Date.now() - m.lastMade) / 6048e5 : 4);
  return weightedPick(
    candidates.map((m) => ({ item: m, weight: weightFor(ratings[mealKey(m.name)]?.stars) * Math.min(1 + weeksSince(m) / 2, 4) })),
    count,
  ).map((m) => ({
    id: newId(),
    name: m.name,
    cuisine: m.cuisine,
    description: m.notes || 'From your favorites gallery.',
    minutes: 0,
    kidFriendly: m.kidFriendly,
    ingredients: [],
    why: m.lastMade ? `Last made ${new Date(m.lastMade).toLocaleDateString()}` : 'One of your favorites',
    fromFavorites: true,
  }));
}

export type GenerateResult = { ideas: MealIdea[]; usedAi: boolean; aiError?: string };

export async function generate(input: GenerateInput): Promise<GenerateResult> {
  const { prefs } = input;
  // Batch cooking: offer 3 options for the one big meal. Otherwise one idea per day.
  const count = input.count ?? (prefs.batchCook ? 3 : Math.min(prefs.days, 14));
  const exclude = new Set((input.exclude ?? []).map(mealKey));

  // Favorites fill part of the plan ("Smart mix") or all of it ("Favorites only").
  let favCount = 0;
  if (prefs.source === 'Favorites only') favCount = count;
  else if (prefs.source === 'Smart mix') favCount = Math.floor(count / 3);
  const favs = favoriteIdeas(input, favCount, exclude);
  favs.forEach((f) => exclude.add(mealKey(f.name)));
  const needed = count - favs.length;
  if (needed <= 0) return { ideas: favs, usedAi: false };

  let fresh: MealIdea[] = [];
  let aiError: string | undefined;
  if (input.apiKey) {
    try {
      const ai = await generateIdeas(input.apiKey, prefs, familyContext(input.ratings, input.meals, input.avoid), needed, [...exclude]);
      fresh = ai.map((i) => ({ ...i, id: newId() }));
    } catch (e) {
      aiError = e instanceof Error ? e.message : String(e);
    }
  }
  const usedAi = fresh.length > 0;
  if (!usedAi) fresh = libraryIdeas(input, needed, exclude);

  // Interleave favorites among new ideas so the week feels varied.
  const ideas: MealIdea[] = [];
  const step = favs.length ? Math.ceil(count / favs.length) : Infinity;
  for (let i = 0, f = 0, n = 0; i < count; i++) {
    if (f < favs.length && (i + 1) % step === 0) ideas.push(favs[f++]);
    else if (n < fresh.length) ideas.push(fresh[n++]);
    else if (f < favs.length) ideas.push(favs[f++]);
  }
  return { ideas, usedAi, aiError };
}
