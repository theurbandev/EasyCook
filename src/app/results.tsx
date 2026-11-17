import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { Button, Card, Empty, Stars, colors, s } from '@/components/ui';
import { getApiKey } from '@/lib/apiKey';
import { generate } from '@/lib/generator';
import { useStore } from '@/lib/store';
import { emojiFor, mealKey, type MealIdea } from '@/lib/types';

export default function ResultsScreen() {
  const store = useStore();
  const { lastIdeas: ideas, prefs } = store;
  const [busy, setBusy] = useState<string | null>(null); // idea id being swapped, or 'all'

  const savedNames = new Set(store.meals.map((m) => mealKey(m.name)));

  async function run(count: number | undefined, exclude: string[]) {
    return generate({ prefs, ratings: store.ratings, meals: store.meals, avoid: store.settings.avoid, apiKey: await getApiKey(), exclude, count });
  }

  async function swap(idea: MealIdea) {
    setBusy(idea.id);
    try {
      // Swapping a favorite pulls another favorite only if the plan is favorites-only.
      const result = await run(1, ideas.map((i) => i.name));
      if (result.ideas[0]) store.replaceIdea(idea.id, result.ideas[0]);
      else Alert.alert('No more matches', 'Try changing your choices for more variety.');
    } finally {
      setBusy(null);
    }
  }

  async function regenerateAll() {
    setBusy('all');
    try {
      const result = await run(undefined, ideas.map((i) => i.name));
      if (result.ideas.length) store.setPlan(prefs, result.ideas);
    } finally {
      setBusy(null);
    }
  }

  function save(idea: MealIdea) {
    if (savedNames.has(mealKey(idea.name))) return;
    store.saveMeal({ name: idea.name, cuisine: idea.cuisine, notes: idea.description, kidFriendly: idea.kidFriendly });
  }

  function openRecipe(idea: MealIdea) {
    const existing = store.recipes.find((r) => mealKey(r.title) === mealKey(idea.name));
    if (existing) router.push({ pathname: '/recipe/[id]', params: { id: existing.id } });
    else router.push({ pathname: '/recipe/generate', params: { dish: idea.name, cuisine: idea.cuisine } });
  }

  function shareList() {
    const lines = ideas.map((i, n) => `${label(n)}: ${i.name}`);
    const shopping = [...new Set(ideas.flatMap((i) => i.ingredients))].sort();
    const text = `EasyCook plan\n\n${lines.join('\n')}${shopping.length ? `\n\nShopping list:\n${shopping.map((x) => `• ${x}`).join('\n')}` : ''}`;
    Share.share({ message: text });
  }

  const label = (n: number) => (prefs.batchCook ? `Option ${n + 1}` : prefs.days === 1 ? `Idea ${n + 1}` : `Day ${n + 1}`);

  if (!ideas.length) {
    return (
      <View style={s.screen}>
        <Empty icon="restaurant-outline" title="No ideas yet" text="Go back and tap Get meal ideas." />
      </View>
    );
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={[s.muted, { marginBottom: 12 }]}>
        {prefs.batchCook
          ? `Pick one big meal to cover ${prefs.days} days for ${prefs.people}.`
          : `${prefs.cuisine === 'Any' ? 'Mixed' : prefs.cuisine} ${prefs.mealType.toLowerCase()} for ${prefs.people}${prefs.kids ? ' (with kids)' : ''}.`}{' '}
        Rate ideas so EasyCook learns what your family likes.
      </Text>

      {ideas.map((idea, n) => {
        const saved = savedNames.has(mealKey(idea.name));
        return (
          <Card key={idea.id}>
            <View style={[s.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{label(n)}</Text>
              {idea.fromFavorites ? (
                <View style={[s.row, { gap: 4 }]}>
                  <Ionicons name="heart" size={14} color={colors.primary} />
                  <Text style={s.muted}>Favorite</Text>
                </View>
              ) : null}
            </View>
            <Text style={s.title}>
              {emojiFor(idea.cuisine)} {idea.name}
            </Text>
            <Text style={[s.muted, { marginVertical: 4 }]}>
              {[idea.cuisine, idea.minutes ? `${idea.minutes} min` : null, idea.kidFriendly ? 'Kid-friendly' : null].filter(Boolean).join(' · ')}
            </Text>
            <Text style={s.body}>{idea.description}</Text>
            {idea.why ? <Text style={[s.muted, { marginTop: 6, fontStyle: 'italic' }]}>{idea.why}</Text> : null}
            {idea.ingredients.length ? (
              <Text style={[s.muted, { marginTop: 8 }]}>
                <Text style={{ fontWeight: '600' }}>Ingredients: </Text>
                {idea.ingredients.join(', ')}
              </Text>
            ) : null}

            <View style={[s.row, { marginTop: 12, justifyContent: 'space-between' }]}>
              <Stars value={store.starsFor(idea.name)} onChange={(v) => store.rate(idea.name, idea.cuisine, v)} />
              <View style={[s.row, { gap: 16 }]}>
                <IconAction icon={saved ? 'heart' : 'heart-outline'} label={saved ? 'Saved' : 'Save'} onPress={() => save(idea)} />
                <IconAction icon="book-outline" label="Recipe" onPress={() => openRecipe(idea)} />
                <IconAction icon="shuffle" label={busy === idea.id ? '…' : 'Swap'} onPress={() => swap(idea)} disabled={!!busy} />
              </View>
            </View>
          </Card>
        );
      })}

      <View style={{ gap: 10, marginTop: 8 }}>
        <Button title="Share plan & shopping list" icon="share-outline" variant="secondary" onPress={shareList} />
        <Button title="New ideas" icon="refresh" variant="secondary" onPress={regenerateAll} loading={busy === 'all'} disabled={!!busy} />
      </View>
    </ScrollView>
  );
}

function IconAction({ icon, label, onPress, disabled }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }} hitSlop={6}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={{ fontSize: 11, color: colors.primary }}>{label}</Text>
    </Pressable>
  );
}
