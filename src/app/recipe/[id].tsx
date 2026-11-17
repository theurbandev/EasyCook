import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { RecipeView } from '@/components/RecipeView';
import { Button, Empty, Stars, colors, s } from '@/components/ui';
import { useStore } from '@/lib/store';
import { mealKey } from '@/lib/types';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const recipe = store.recipes.find((r) => r.id === id);

  if (!recipe) return <Empty icon="alert-circle-outline" title="Recipe not found" text="It may have been deleted." />;

  const inFavorites = store.meals.some((m) => mealKey(m.name) === mealKey(recipe.title));

  function share() {
    const text = [
      recipe!.title,
      '',
      'Ingredients:',
      ...recipe!.ingredients.map((i) => `• ${i}`),
      '',
      'Steps:',
      ...recipe!.steps.map((st, n) => `${n + 1}. ${st}`),
      recipe!.notes ? `\nNotes: ${recipe!.notes}` : '',
    ].join('\n');
    Share.share({ message: text });
  }

  function confirmDelete() {
    Alert.alert('Delete this recipe?', recipe!.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          store.deleteRecipe(recipe!.id);
        },
      },
    ]);
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <Pressable onPress={() => router.push({ pathname: '/recipe/new', params: { id: recipe.id } })} hitSlop={8}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Edit</Text>
            </Pressable>
          ),
        }}
      />
      <RecipeView recipe={recipe} photoUri={recipe.photoUri} />
      <View style={[s.row, { justifyContent: 'space-between', marginBottom: 16 }]}>
        <Text style={s.label}>Rate this recipe</Text>
        <Stars value={store.starsFor(recipe.title)} onChange={(v) => store.rate(recipe.title, recipe.cuisine, v)} size={28} />
      </View>
      <View style={{ gap: 10 }}>
        {!inFavorites ? (
          <Button
            title="Add to favorites"
            icon="heart-outline"
            onPress={() => store.saveMeal({ name: recipe.title, cuisine: recipe.cuisine, notes: '', kidFriendly: store.settings.hasKids, recipeId: recipe.id })}
          />
        ) : null}
        <Button title="Share" icon="share-outline" variant="secondary" onPress={share} />
        <Button title="Delete" icon="trash-outline" variant="danger" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}
