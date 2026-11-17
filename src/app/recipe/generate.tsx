import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RecipeView } from '@/components/RecipeView';
import { Button, Card, Field, Section, Stepper, ToggleRow, colors, s } from '@/components/ui';
import { generateRecipe, type AiRecipe } from '@/lib/ai';
import { getApiKey } from '@/lib/apiKey';
import { useStore } from '@/lib/store';

export default function GenerateRecipeScreen() {
  const params = useLocalSearchParams<{ dish?: string; cuisine?: string; mealId?: string }>();
  const store = useStore();
  const [dish, setDish] = useState(params.dish ?? '');
  const [servings, setServings] = useState(store.settings.defaultPeople);
  const [kids, setKids] = useState(store.settings.hasKids);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<AiRecipe | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    getApiKey().then((k) => setHasKey(!!k));
  }, []);

  async function run() {
    const key = await getApiKey();
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      setRecipe(await generateRecipe(key, dish.trim(), { servings, kids, notes, avoid: store.settings.avoid }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!recipe) return;
    const saved = store.saveRecipe({ ...recipe, cuisine: recipe.cuisine || params.cuisine || '', source: 'ai' });
    if (params.mealId) store.updateMeal(params.mealId, { recipeId: saved.id });
    router.dismiss();
    router.push({ pathname: '/recipe/[id]', params: { id: saved.id } });
  }

  if (hasKey === false) {
    return (
      <View style={[s.screen, s.content]}>
        <Card>
          <Text style={s.sectionTitle}>Add an API key to generate recipes</Text>
          <Text style={s.body}>
            Recipe generation uses Claude. Add your Anthropic API key in Settings, or write the recipe yourself.
          </Text>
        </Card>
        <View style={{ gap: 10 }}>
          <Button title="Go to Settings" icon="settings-outline" onPress={() => { router.dismiss(); router.navigate('/settings'); }} />
          <Button title="Write it myself" icon="create-outline" variant="secondary" onPress={() => router.replace({ pathname: '/recipe/new', params: { title: dish, cuisine: params.cuisine ?? '', mealId: params.mealId ?? '' } })} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {recipe ? (
        <>
          <RecipeView recipe={recipe} />
          <View style={{ gap: 10 }}>
            <Button title="Save recipe" icon="checkmark" onPress={save} />
            <Button title="Try again" icon="refresh" variant="secondary" onPress={run} loading={loading} />
          </View>
        </>
      ) : (
        <>
          <Field label="What dish?" placeholder="e.g. Chicken tikka masala" value={dish} onChangeText={setDish} />
          <Section title="Servings">
            <Stepper value={servings} onChange={setServings} max={20} />
          </Section>
          <ToggleRow label="Make it kid-friendly" value={kids} onChange={setKids} />
          <View style={{ height: 12 }} />
          <Field label="Anything to know?" placeholder="e.g. slow cooker, no dairy, use what's in the pantry" value={notes} onChangeText={setNotes} multiline />
          {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}
          <Button title={loading ? 'Writing your recipe…' : 'Generate recipe'} icon="sparkles" onPress={run} loading={loading} disabled={!dish.trim()} />
        </>
      )}
    </ScrollView>
  );
}
