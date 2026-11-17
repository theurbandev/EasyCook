import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Empty, PageTitle, Stars, colors, gradients, s } from '@/components/ui';
import { useStore } from '@/lib/store';
import { emojiFor, type SavedMeal } from '@/lib/types';

const SORTS = ['Top rated', 'Recent', 'Most made'] as const;

export default function FavoritesScreen() {
  const store = useStore();
  const { starsFor } = store;
  const [cuisine, setCuisine] = useState('All');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Top rated');

  const cuisines = useMemo(() => ['All', ...new Set(store.meals.map((m) => m.cuisine).filter(Boolean))], [store.meals]);

  const meals = useMemo(() => {
    const list = store.meals.filter((m) => cuisine === 'All' || m.cuisine === cuisine);
    const by: Record<typeof sort, (a: SavedMeal, b: SavedMeal) => number> = {
      'Top rated': (a, b) => starsFor(b.name) - starsFor(a.name),
      Recent: (a, b) => (b.lastMade ?? b.createdAt) - (a.lastMade ?? a.createdAt),
      'Most made': (a, b) => b.timesMade - a.timesMade,
    };
    return [...list].sort(by[sort]);
  }, [store.meals, starsFor, cuisine, sort]);

  function surprise() {
    // Favor high ratings, but give everything a chance.
    const pool = meals.flatMap((m) => Array(Math.max(1, store.starsFor(m.name) || 3)).fill(m) as SavedMeal[]);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    Alert.alert('How about…', pick.name, [
      { text: 'Pick again', onPress: surprise },
      { text: 'Open', onPress: () => router.push({ pathname: '/meal/[id]', params: { id: pick.id } }) },
    ]);
  }

  return (
    <View style={s.screen}>
      <FlatList
        data={meals}
        keyExtractor={(m) => m.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={[s.content, { gap: 12 }]}
        ListHeaderComponent={
          <>
            <PageTitle title="Favorites" subtitle="Everything your family loved" />
            {store.meals.length ? (
            <View style={{ gap: 10, marginBottom: 4 }}>
              <View style={[s.row, { gap: 10 }]}>
                <Button title="Add meal" icon="add" onPress={() => router.push('/meal/new')} style={{ flex: 1 }} />
                <Button title="Surprise me" icon="dice-outline" variant="secondary" onPress={surprise} style={{ flex: 1 }} disabled={!meals.length} />
              </View>
              <FlatList
                horizontal
                data={cuisines}
                keyExtractor={(c) => c}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => <Chip label={item} selected={cuisine === item} onPress={() => setCuisine(item)} />}
              />
              <View style={[s.row, { gap: 14 }]}>
                {SORTS.map((o) => (
                  <Pressable key={o} onPress={() => setSort(o)}>
                    <Text style={{ color: sort === o ? colors.primary : colors.muted, fontWeight: sort === o ? '700' : '400' }}>{o}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          <Empty icon="heart-outline" title="Your family's favorites" text="Save meals you loved — with a photo — so you can find them again and get ideas from them.">
            <Button title="Add your first meal" icon="add" onPress={() => router.push('/meal/new')} />
          </Empty>
        }
        renderItem={({ item }) => <MealTile meal={item} stars={store.starsFor(item.name)} />}
      />
    </View>
  );
}

function MealTile({ meal, stars }: { meal: SavedMeal; stars: number }) {
  return (
    <Pressable style={tile.wrap} onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}>
      {meal.photoUri ? (
        <Image source={{ uri: meal.photoUri }} style={tile.photo} contentFit="cover" />
      ) : (
        <View style={[tile.photo, tile.placeholder]}>
          <Text style={{ fontSize: 44 }}>{emojiFor(meal.cuisine)}</Text>
        </View>
      )}
      <View style={{ padding: 10, gap: 4 }}>
        <Text style={tile.name} numberOfLines={2}>
          {meal.name}
        </Text>
        <Text style={s.muted} numberOfLines={1}>
          {meal.cuisine || 'Other'}
          {meal.timesMade ? ` · made ${meal.timesMade}×` : ''}
        </Text>
        <Stars value={stars} size={14} />
      </View>
    </Pressable>
  );
}

const tile = StyleSheet.create({
  wrap: { flex: 1, maxWidth: '50%', backgroundColor: colors.card, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  photo: { width: '100%', aspectRatio: 4 / 3 },
  placeholder: { backgroundImage: gradients.tileWarm, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
});
