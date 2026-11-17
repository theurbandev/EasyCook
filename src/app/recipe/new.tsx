import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, colors, gradients, s } from '@/components/ui';
import { readRecipePhoto, type PhotoReading } from '@/lib/ai';
import { getApiKey } from '@/lib/apiKey';
import { deletePhoto, pickPhoto, readPhoto } from '@/lib/photos';
import { useStore } from '@/lib/store';

const toLines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.replace(/^\s*(\d+[.)]|[-•*])\s*/, '').trim())
    .filter(Boolean);

/** Add a recipe by hand or from a photo, or edit an existing one when `id` is passed. */
export default function RecipeFormScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string; cuisine?: string; mealId?: string; fromPhoto?: string }>();
  const store = useStore();
  const existing = store.recipes.find((r) => r.id === params.id);

  const [title, setTitle] = useState(existing?.title ?? params.title ?? '');
  const [cuisine, setCuisine] = useState(existing?.cuisine ?? params.cuisine ?? '');
  const [servings, setServings] = useState(String(existing?.servings ?? store.settings.defaultPeople));
  const [prep, setPrep] = useState(String(existing?.prepMinutes ?? 15));
  const [cook, setCook] = useState(String(existing?.cookMinutes ?? 30));
  const [ingredients, setIngredients] = useState(existing?.ingredients.join('\n') ?? '');
  const [steps, setSteps] = useState(existing?.steps.join('\n') ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [photoUri, setPhotoUri] = useState(existing?.photoUri);
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState<string | null>(null);

  async function addPhoto(camera: boolean) {
    // Recipe cards need the whole page, so skip the crop step.
    const uri = await pickPhoto(camera, { crop: false });
    if (!uri) return;
    if (photoUri && photoUri !== existing?.photoUri) deletePhoto(photoUri);
    setPhotoUri(uri);
    setScanNote(null);
    if (await getApiKey()) scan(uri);
  }

  function apply(reading: PhotoReading, mode: 'replace' | 'add') {
    const found = reading.ingredients.join('\n');
    setIngredients((current) => (mode === 'add' && current.trim() ? `${current.trim()}\n${found}` : found));
    // Only fill fields the user hasn't written yet, so the photo never overwrites their edits.
    if (!title.trim() && reading.title) setTitle(reading.title);
    if (!cuisine.trim() && reading.cuisine) setCuisine(reading.cuisine);
    if (!steps.trim() && reading.steps.length) setSteps(reading.steps.join('\n'));
    if (!notes.trim() && reading.notes) setNotes(reading.notes);
    if (reading.kind === 'recipe') {
      if (reading.servings > 0) setServings(String(reading.servings));
      if (reading.prepMinutes > 0) setPrep(String(reading.prepMinutes));
      if (reading.cookMinutes > 0) setCook(String(reading.cookMinutes));
    }
    setScanNote(
      reading.kind === 'dish'
        ? 'These ingredients are a best guess from the dish. Check them and edit anything below.'
        : 'Filled in from your photo. Check everything and edit anything below.',
    );
  }

  async function scan(uri = photoUri) {
    if (!uri) return;
    const key = await getApiKey();
    if (!key) {
      Alert.alert('Add an API key', 'Reading recipes from photos uses Claude. Add your Anthropic API key in Settings, or type the ingredients yourself.');
      return;
    }
    setScanning(true);
    try {
      const reading = await readRecipePhoto(key, await readPhoto(uri));
      if (reading.kind === 'other' || !reading.ingredients.length) {
        Alert.alert('No recipe found', "Claude couldn't find a recipe or dish in that photo. Try a clearer photo, or type the ingredients yourself.");
        return;
      }
      if (ingredients.trim()) {
        Alert.alert('Update ingredients?', `Found ${reading.ingredients.length} ingredients in the photo.`, [
          { text: 'Replace mine', onPress: () => apply(reading, 'replace') },
          { text: 'Add to mine', onPress: () => apply(reading, 'add') },
          { text: 'Cancel', style: 'cancel' },
        ]);
      } else {
        apply(reading, 'replace');
      }
    } catch (e) {
      Alert.alert("Couldn't read the photo", e instanceof Error ? e.message : String(e));
    } finally {
      setScanning(false);
    }
  }

  function removePhoto() {
    if (photoUri && photoUri !== existing?.photoUri) deletePhoto(photoUri);
    setPhotoUri(undefined);
    setScanNote(null);
  }

  function save() {
    if (existing?.photoUri && existing.photoUri !== photoUri) deletePhoto(existing.photoUri);
    const recipe = store.saveRecipe({
      id: existing?.id,
      title: title.trim(),
      cuisine: cuisine.trim(),
      servings: parseInt(servings, 10) || 1,
      prepMinutes: parseInt(prep, 10) || 0,
      cookMinutes: parseInt(cook, 10) || 0,
      ingredients: toLines(ingredients),
      steps: toLines(steps),
      notes: notes.trim(),
      photoUri,
      source: existing?.source ?? 'manual',
    });
    if (params.mealId) store.updateMeal(params.mealId, { recipeId: recipe.id });
    router.back();
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: existing ? 'Edit recipe' : params.fromPhoto ? 'Recipe from a photo' : 'New recipe' }} />

      {photoUri ? (
        <View>
          <Image source={{ uri: photoUri }} style={f.photo} contentFit="cover" />
          <Pressable onPress={removePhoto} style={f.remove} hitSlop={8} accessibilityLabel="Remove photo">
            <Ionicons name="close" size={18} color={colors.text} />
          </Pressable>
        </View>
      ) : (
        <View style={[f.photo, f.placeholder]}>
          <Ionicons name="camera-outline" size={36} color={colors.text} />
          <Text style={[s.body, { textAlign: 'center' }]}>Snap a recipe card, cookbook page or the finished dish</Text>
          <Text style={[s.muted, { textAlign: 'center' }]}>Claude will pull out the ingredients for you</Text>
        </View>
      )}
      <View style={[s.row, { gap: 10, marginBottom: 12 }]}>
        <Button title="Camera" icon="camera-outline" variant="secondary" onPress={() => addPhoto(true)} style={{ flex: 1 }} disabled={scanning} />
        <Button title="Library" icon="images-outline" variant="secondary" onPress={() => addPhoto(false)} style={{ flex: 1 }} disabled={scanning} />
      </View>
      {photoUri ? (
        <Button title={scanning ? 'Reading your photo…' : 'Get ingredients from photo'} icon="sparkles" onPress={() => scan()} loading={scanning} style={{ marginBottom: 12 }} />
      ) : null}
      {scanNote ? (
        <Card style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <Ionicons name="sparkles" size={18} color={colors.primary} />
          <Text style={[s.body, { flex: 1 }]}>{scanNote}</Text>
        </Card>
      ) : null}
      <View style={{ height: 8 }} />

      <Field label="Recipe name" placeholder="e.g. Dad's Sunday chili" value={title} onChangeText={setTitle} />
      <Field label="Cuisine" placeholder="e.g. Mexican" value={cuisine} onChangeText={setCuisine} />
      <View style={[s.row, { gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Field label="Serves" keyboardType="number-pad" value={servings} onChangeText={setServings} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Prep min" keyboardType="number-pad" value={prep} onChangeText={setPrep} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Cook min" keyboardType="number-pad" value={cook} onChangeText={setCook} />
        </View>
      </View>
      <Field label="Ingredients (one per line)" placeholder={'2 lb ground beef\n1 onion, diced\n…'} value={ingredients} onChangeText={setIngredients} multiline />
      <Field label="Steps (one per line)" placeholder={'Brown the beef\nAdd onion and cook 5 min\n…'} value={steps} onChangeText={setSteps} multiline />
      <Field label="Notes" placeholder="Tips, swaps, what the kids think…" value={notes} onChangeText={setNotes} multiline />
      <Button title="Save recipe" icon="checkmark" onPress={save} disabled={!title.trim() || scanning} />
    </ScrollView>
  );
}

const f = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: 22, marginBottom: 12 },
  placeholder: { backgroundImage: gradients.tileCool, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  remove: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
});
