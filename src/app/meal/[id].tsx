import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MealForm } from '@/components/MealForm';
import { Button, Card, Empty, Stars, colors, s } from '@/components/ui';
import { deletePhoto } from '@/lib/photos';
import { useStore } from '@/lib/store';
import { mealKey } from '@/lib/types';

export default function MealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const meal = store.meals.find((m) => m.id === id);

  if (!meal) return <Empty icon="alert-circle-outline" title="Meal not found" text="It may have been deleted." />;

  const stars = store.starsFor(meal.name);
  const recipe =
    store.recipes.find((r) => r.id === meal.recipeId) ?? store.recipes.find((r) => mealKey(r.title) === mealKey(meal.name));

  if (editing) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit favorite' }} />
        <MealForm
          submitLabel="Save changes"
          initial={{ ...meal, stars }}
          onSubmit={({ stars: newStars, ...patch }) => {
            if (meal.photoUri && meal.photoUri !== patch.photoUri) deletePhoto(meal.photoUri);
            store.updateMeal(meal.id, patch);
            store.rate(patch.name, patch.cuisine, newStars);
            setEditing(false);
          }}
        />
      </>
    );
  }

  function confirmDelete() {
    Alert.alert('Delete this favorite?', meal!.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          store.deleteMeal(meal!.id);
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
            <Pressable onPress={() => setEditing(true)} hitSlop={8}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Edit</Text>
            </Pressable>
          ),
        }}
      />
      {meal.photoUri ? <Image source={{ uri: meal.photoUri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 16, marginBottom: 14 }} contentFit="cover" /> : null}
      <Text style={s.title}>{meal.name}</Text>
      <Text style={[s.muted, { marginVertical: 6 }]}>
        {[meal.cuisine, meal.kidFriendly ? 'Kids liked it' : null, meal.timesMade ? `Made ${meal.timesMade}×` : null, meal.lastMade ? `last ${new Date(meal.lastMade).toLocaleDateString()}` : null]
          .filter(Boolean)
          .join(' · ')}
      </Text>
      <View style={{ marginVertical: 8 }}>
        <Stars value={stars} onChange={(v) => store.rate(meal.name, meal.cuisine, v)} size={30} />
      </View>
      {meal.notes ? (
        <Card>
          <Text style={s.body}>{meal.notes}</Text>
        </Card>
      ) : null}

      <View style={{ gap: 10, marginTop: 8 }}>
        <Button title="We made it again!" icon="checkmark-circle-outline" onPress={() => store.markMade(meal.id)} />
        {recipe ? (
          <Button title="Open recipe" icon="book-outline" variant="secondary" onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })} />
        ) : (
          <View style={[s.row, { gap: 10 }]}>
            <Button
              title="Write recipe"
              icon="create-outline"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/recipe/new', params: { title: meal.name, cuisine: meal.cuisine, mealId: meal.id } })}
            />
            <Button
              title="Generate"
              icon="sparkles-outline"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/recipe/generate', params: { dish: meal.name, cuisine: meal.cuisine, mealId: meal.id } })}
            />
          </View>
        )}
        <Button title="Delete" icon="trash-outline" variant="danger" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}
