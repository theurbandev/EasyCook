import type { PhotoData } from './photos';
import type { Prefs } from './types';

const MODEL = 'claude-opus-5-5';

export type AiIdea = {
  name: string;
  cuisine: string;
  description: string;
  minutes: number;
  kidFriendly: boolean;
  ingredients: string[];
  why: string;
};

export type AiRecipe = {
  title: string;
  cuisine: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: string[];
  steps: string[];
  notes: string;
};

const ideaSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'cuisine', 'description', 'minutes', 'kidFriendly', 'ingredients', 'why'],
  properties: {
    name: { type: 'string' },
    cuisine: { type: 'string' },
    description: { type: 'string', description: 'One appetizing sentence.' },
    minutes: { type: 'integer', description: 'Total active + cook time.' },
    kidFriendly: { type: 'boolean' },
    ingredients: { type: 'array', items: { type: 'string' }, description: 'Main shopping-list ingredients.' },
    why: { type: 'string', description: 'Short reason this fits the family, e.g. "Like the tacos you rated 5 stars".' },
  },
};

const recipeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'cuisine', 'servings', 'prepMinutes', 'cookMinutes', 'ingredients', 'steps', 'notes'],
  properties: {
    title: { type: 'string' },
    cuisine: { type: 'string' },
    servings: { type: 'integer' },
    prepMinutes: { type: 'integer' },
    cookMinutes: { type: 'integer' },
    ingredients: { type: 'array', items: { type: 'string' }, description: 'Each with quantity, e.g. "2 cups jasmine rice".' },
    steps: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string', description: 'Tips, swaps for kids, storage/leftover advice.' },
  },
};

export class AiError extends Error {}

type MessagesResponse = {
  stop_reason: string | null;
  content: { type: string; text?: string }[];
};

// Raw HTTP rather than @anthropic-ai/sdk: the SDK's modules import each other in a cycle
// that Metro's dev runtime can't evaluate.
type Content = string | ({ type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } })[];

async function askJson<T>(apiKey: string, system: string, prompt: Content, schema: object, effort: 'low' | 'medium'): Promise<T> {
  let res: Response;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2026-10-21',
        // Retries on another model if Claude Opus 5.5 declines a request.
        'anthropic-beta': 'server-side-fallback-2026-07-01',
        // Needed for the web preview only; native apps aren't subject to CORS.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        fallbacks: 'default',
        output_config: { effort, format: { type: 'json_schema', schema } },
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch {
    throw new AiError('Could not reach Claude. Check your internet connection.');
  }

  if (!res.ok) {
    if (res.status === 401) throw new AiError('Your API key was rejected. Check it in Settings.');
    if (res.status === 429) throw new AiError('Too many requests right now. Wait a moment and try again.');
    if (res.status === 529 || res.status >= 500) throw new AiError('Claude is busy right now. Please try again in a minute.');
    const body = await res.json().catch(() => null);
    throw new AiError(`Claude error (${res.status}): ${body?.error?.message ?? res.statusText}`);
  }

  const data = (await res.json()) as MessagesResponse;
  if (data.stop_reason === 'refusal') throw new AiError("Claude couldn't help with that request. Try rewording it.");
  if (data.stop_reason === 'max_tokens') throw new AiError('The answer was cut off. Try asking for fewer meals.');
  const text = data.content.find((b) => b.type === 'text')?.text;
  if (!text) throw new AiError('Claude returned an empty answer. Please try again.');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AiError('Claude returned an unexpected answer. Please try again.');
  }
}

export type FamilyContext = {
  loved: string[]; // rated 4-5 stars
  disliked: string[]; // rated 1-2 stars
  gallery: string[];
  avoid: string;
};

const SYSTEM =
  'You are a friendly family meal planner. Suggest realistic home-cookable meals using ingredients from a typical grocery store. ' +
  "Respect every dietary restriction and avoided ingredient strictly. Never suggest a meal the family disliked. " +
  'Lean toward meals similar to ones they loved, but keep variety: no two suggestions should be near-duplicates.';

function describePrefs(p: Prefs, count: number) {
  const lines = [
    `Meal: ${p.mealType}`,
    `Cuisine: ${p.cuisine === 'Any' ? 'any cuisine, varied' : p.cuisine}`,
    `Feeding ${p.people} people${p.kids ? ', including kids (keep it kid-friendly, mild spice, or offer a kid tweak)' : ', adults only'}`,
    p.batchCook
      ? `Cook once to last ${p.days} days: suggest ${count} different big-batch meals that reheat well; any one of them should feed ${p.people} people for ${p.days} days.`
      : `Planning ${p.days} day(s): suggest ${count} different meals, one per day.`,
    `Time limit: ${p.maxMinutes ? `${p.maxMinutes} minutes or less` : 'none'}`,
    `Budget: ${p.budget}`,
    `Effort: ${p.effort}`,
  ];
  if (p.diets.length) lines.push(`Dietary needs (strict): ${p.diets.join(', ')}`);
  if (p.notes.trim()) lines.push(`Extra notes: ${p.notes.trim()}`);
  return lines.join('\n');
}

function describeFamily(f: FamilyContext, exclude: string[]) {
  const lines: string[] = [];
  if (f.loved.length) lines.push(`Meals the family loved: ${f.loved.join(', ')}`);
  if (f.gallery.length) lines.push(`Meals in their favorites gallery: ${f.gallery.join(', ')}`);
  if (f.disliked.length) lines.push(`Meals they disliked (never suggest): ${f.disliked.join(', ')}`);
  if (f.avoid.trim()) lines.push(`Ingredients nobody eats (never use): ${f.avoid}`);
  if (exclude.length) lines.push(`Do not repeat these already-suggested meals: ${exclude.join(', ')}`);
  return lines.join('\n');
}

export async function generateIdeas(apiKey: string, prefs: Prefs, family: FamilyContext, count: number, exclude: string[] = []) {
  const prompt = `${describePrefs(prefs, count)}\n\n${describeFamily(family, exclude)}\n\nReturn exactly ${count} meal ideas.`;
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['ideas'],
    properties: { ideas: { type: 'array', items: ideaSchema } },
  };
  const out = await askJson<{ ideas: AiIdea[] }>(apiKey, SYSTEM, prompt, schema, 'low');
  return out.ideas.slice(0, count);
}

export async function generateRecipe(
  apiKey: string,
  dish: string,
  opts: { servings: number; kids: boolean; notes: string; avoid: string },
) {
  const prompt = [
    `Write a complete, reliable home recipe for: ${dish}`,
    `Servings: ${opts.servings}`,
    opts.kids ? 'Kids will be eating this: keep it mild and include a kid-friendly tip.' : '',
    opts.avoid.trim() ? `Never use these ingredients: ${opts.avoid}` : '',
    opts.notes.trim() ? `Notes: ${opts.notes.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return askJson<AiRecipe>(
    apiKey,
    'You are an experienced home cook who writes clear, tested recipes with exact US quantities and numbered, concise steps.',
    prompt,
    recipeSchema,
    'medium',
  );
}

export type PhotoReading = {
  kind: 'recipe' | 'dish' | 'other';
  title: string;
  cuisine: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: string[];
  steps: string[];
  notes: string;
};

const photoSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'title', 'cuisine', 'servings', 'prepMinutes', 'cookMinutes', 'ingredients', 'steps', 'notes'],
  properties: {
    kind: {
      type: 'string',
      enum: ['recipe', 'dish', 'other'],
      description: 'recipe = a written recipe (card, cookbook page, screenshot); dish = a photo of food; other = neither.',
    },
    title: { type: 'string' },
    cuisine: { type: 'string', description: 'e.g. Mexican, Italian. Empty if unclear.' },
    servings: { type: 'integer', description: '0 if not stated.' },
    prepMinutes: { type: 'integer', description: '0 if not stated.' },
    cookMinutes: { type: 'integer', description: '0 if not stated.' },
    ingredients: { type: 'array', items: { type: 'string' }, description: 'One ingredient per item, with its quantity when known.' },
    steps: { type: 'array', items: { type: 'string' }, description: 'Only steps written in the photo; empty for a dish photo.' },
    notes: { type: 'string', description: 'Anything worth flagging, e.g. unreadable parts or that ingredients are a best guess.' },
  },
};

/** Reads ingredients (and steps, when written) from a photo of a recipe or a finished dish. */
export async function readRecipePhoto(apiKey: string, photo: PhotoData) {
  if (photo.data.length > 5_000_000) throw new AiError('That photo is too large. Try a smaller or cropped photo.');
  return askJson<PhotoReading>(
    apiKey,
    'You help home cooks save recipes from photos. For a written recipe, transcribe the ingredients and steps exactly as written, ' +
      'fixing only obvious OCR-style slips. For a photo of a dish, identify it and list the ingredients it most likely contains, ' +
      'with typical quantities for a family meal, and say in notes that they are a best guess. Never invent steps for a dish photo.',
    [
      { type: 'image', source: { type: 'base64', media_type: photo.mediaType, data: photo.data } },
      { type: 'text', text: 'Read this photo and return the recipe details.' },
    ],
    photoSchema,
    'medium',
  );
}
