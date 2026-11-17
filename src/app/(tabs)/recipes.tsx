import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Button, Empty, PageTitle, Stars, colors, s } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function RecipesScreen() {
  const store = useStore();
  const [query, setQuery] = useState('');

  const recipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.recipes;
    return store.recipes.filter(
      (r) => r.title.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q)),
    );
  }, [store.recipes, query]);

  return (
    <FlatList
      style={s.screen}
      contentContainerStyle={s.content}
      data={recipes}
      keyExtractor={(r) => r.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: 10, marginBottom: 14 }}>
          <PageTitle title="Recipes" subtitle="Yours, and ones Claude wrote for you" />
          <View style={[s.row, { gap: 10 }]}>
            <Button title="Add my own" icon="create-outline" onPress={() => router.push('/recipe/new')} style={{ flex: 1 }} />
            <Button title="Generate" icon="sparkles-outline" variant="secondary" onPress={() => router.push('/recipe/generate')} style={{ flex: 1 }} />
          </View>
          <Button title="From a photo" icon="camera-outline" variant="secondary" onPress={() => router.push({ pathname: '/recipe/new', params: { fromPhoto: '1' } })} />
          {store.recipes.length > 3 ? (
            <View style={[s.row, s.input, { paddingVertical: 8 }]}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput placeholder="Search recipes or ingredients" value={query} onChangeText={setQuery} style={{ flex: 1, fontSize: 16, color: colors.text }} placeholderTextColor={colors.muted} />
            </View>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <Empty
          icon="book-outline"
          title={query ? 'No matches' : 'No recipes yet'}
          text={query ? 'Try a different word.' : 'Type in a family recipe, or have EasyCook write one for any dish.'}
        />
      }
      renderItem={({ item }) => (
        <Pressable style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })}>
          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} style={{ width: 52, height: 52, borderRadius: 14 }} contentFit="cover" />
          ) : (
            <Ionicons name={item.source === 'ai' ? 'sparkles' : 'create'} size={22} color={colors.primary} />
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{item.title}</Text>
            <Text style={s.muted}>
              {[item.cuisine, `${item.prepMinutes + item.cookMinutes} min`, `serves ${item.servings}`].filter(Boolean).join(' · ')}
            </Text>
            <Stars value={store.starsFor(item.title)} size={13} />
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      )}
    />
  );
}
