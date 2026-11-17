import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Chip, ChipRow, Field, Section, Stars, Stepper, ToggleRow, colors, glow, gradients, s } from '@/components/ui';
import { getApiKey } from '@/lib/apiKey';
import { generate } from '@/lib/generator';
import { useStore } from '@/lib/store';
import { BUDGETS, CUISINES, DIETS, EFFORTS, MEAL_TYPES, SOURCES, TIME_LIMITS, type Prefs } from '@/lib/types';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  return hour < 18 ? 'Good afternoon' : 'Good evening';
}

export default function PickScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState<Prefs>(store.prefs);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => setPrefs((p) => ({ ...p, [key]: value }));
  const toggleDiet = (d: Prefs['diets'][number]) =>
    set('diets', prefs.diets.includes(d) ? prefs.diets.filter((x) => x !== d) : [...prefs.diets, d]);

  async function onGenerate(prefs: Prefs) {
    if (prefs.source === 'Favorites only' && store.meals.length === 0) {
      Alert.alert('No favorites yet', 'Add meals you love in the Favorites tab, or choose "Smart mix".');
      return;
    }
    setLoading(true);
    try {
      const result = await generate({
        prefs,
        ratings: store.ratings,
        meals: store.meals,
        avoid: store.settings.avoid,
        apiKey: await getApiKey(),
      });
      if (result.ideas.length === 0) {
        Alert.alert('No matches', 'Nothing fits all of those choices. Try loosening the cuisine, diet or time limit.');
        return;
      }
      store.setPlan(prefs, result.ideas);
      if (result.aiError) Alert.alert('Using built-in ideas', `${result.aiError}\n\nShowing ideas from the built-in meal list instead.`);
      router.push('/results');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={[home.hero, { paddingTop: insets.top + 8 }]}>
        <View style={home.orb} />
        <Text style={home.greeting}>{greeting()}</Text>
        <Text style={home.headline}>What&apos;s for {prefs.mealType.toLowerCase()}?</Text>
      </View>

      <View style={home.tiles}>
        <Pressable style={[home.tile, { backgroundImage: gradients.tileWarm }]} onPress={() => onGenerate({ ...prefs, cuisine: 'Any', notes: '' })} disabled={loading}>
          <Text style={home.tileText}>Surprise{'\n'}me</Text>
          <View style={home.tileArrow}>
            <Ionicons name="sparkles" size={16} color={colors.bg} />
          </View>
        </Pressable>
        <Pressable style={[home.tile, { backgroundImage: gradients.tileCool }]} onPress={() => router.navigate('/favorites')}>
          <Text style={home.tileText}>Our{'\n'}favorites</Text>
          <View style={home.tileArrow}>
            <Ionicons name="chevron-forward" size={18} color={colors.bg} />
          </View>
        </Pressable>
      </View>

      <Text style={home.formTitle}>Or tell us what you need</Text>

      <Section title="What kind of food?">
        <ChipRow>
          {CUISINES.map((c) => (
            <Chip key={c} label={c} selected={prefs.cuisine === c} onPress={() => set('cuisine', c)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Which meal?">
        <ChipRow>
          {MEAL_TYPES.map((m) => (
            <Chip key={m} label={m} selected={prefs.mealType === m} onPress={() => set('mealType', m)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="How many days?">
        <Stepper value={prefs.days} onChange={(n) => set('days', n)} suffix={prefs.days === 1 ? 'day' : 'days'} />
        <Text style={[s.muted, { marginTop: 10, marginBottom: 8 }]}>
          {prefs.batchCook ? `One big meal to cover ${prefs.days} days of leftovers.` : prefs.days === 1 ? 'One meal for today.' : `${prefs.days} different meals, one per day.`}
        </Text>
        <ToggleRow label="Cook once, eat leftovers" hint="Pick one big-batch meal that lasts all the days" value={prefs.batchCook} onChange={(v) => set('batchCook', v)} />
      </Section>

      <Section title="Who's eating?">
        <Stepper value={prefs.people} onChange={(n) => set('people', n)} max={20} suffix={prefs.people === 1 ? 'person' : 'people'} />
        <ToggleRow label="Kids are eating too" hint="Favor mild, kid-friendly meals" value={prefs.kids} onChange={(v) => set('kids', v)} />
      </Section>

      <Section title="How much time?">
        <ChipRow>
          {TIME_LIMITS.map((t) => (
            <Chip key={t} label={t ? `≤ ${t} min` : 'No limit'} selected={prefs.maxMinutes === t} onPress={() => set('maxMinutes', t)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Dietary needs" hint="Every suggestion will follow these">
        <ChipRow>
          {DIETS.map((d) => (
            <Chip key={d} label={d} selected={prefs.diets.includes(d)} onPress={() => toggleDiet(d)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Budget">
        <ChipRow>
          {BUDGETS.map((b) => (
            <Chip key={b} label={b} selected={prefs.budget === b} onPress={() => set('budget', b)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Effort">
        <ChipRow>
          {EFFORTS.map((e) => (
            <Chip key={e} label={e} selected={prefs.effort === e} onPress={() => set('effort', e)} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Where should ideas come from?">
        <ChipRow>
          {SOURCES.map((src) => (
            <Chip key={src} label={src} selected={prefs.source === src} onPress={() => set('source', src)} />
          ))}
        </ChipRow>
        <Text style={[s.muted, { marginTop: 8 }]}>Smart mix blends new ideas with meals from your Favorites.</Text>
      </Section>

      <Field
        label="Anything else?"
        placeholder="e.g. use up the chicken in the fridge, no mushrooms, something cozy"
        value={prefs.notes}
        onChangeText={(t) => set('notes', t)}
        multiline
      />

      <Button title={loading ? 'Thinking…' : 'Get meal ideas'} icon="sparkles" onPress={() => onGenerate(prefs)} loading={loading} />

      {store.meals.length ? (
        <View style={{ marginTop: 30 }}>
          <Text style={home.formTitle}>Recently loved</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {store.meals.slice(0, 8).map((meal) => (
              <Pressable key={meal.id} style={home.recent} onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}>
                {meal.photoUri ? <Image source={{ uri: meal.photoUri }} style={home.recentPhoto} contentFit="cover" /> : null}
                <Text style={s.label} numberOfLines={2}>
                  {meal.name}
                </Text>
                <Stars value={store.starsFor(meal.name)} size={13} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </ScrollView>
  );
}

const home = StyleSheet.create({
  hero: { minHeight: 210, justifyContent: 'flex-end', marginBottom: 20 },
  orb: { position: 'absolute', top: 44, right: -34, width: 170, height: 170, borderRadius: 85, backgroundImage: gradients.orb, boxShadow: '0px 0px 60px rgba(232,65,143,0.6)' },
  greeting: { fontSize: 16, color: colors.muted, marginBottom: 6 },
  headline: { fontSize: 38, lineHeight: 43, fontWeight: '700', color: colors.text, letterSpacing: -0.8, maxWidth: '78%' },
  tiles: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  tile: { flex: 1, height: 124, borderRadius: 26, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', justifyContent: 'space-between', boxShadow: glow },
  tileText: { fontSize: 19, lineHeight: 24, fontWeight: '700', color: colors.text },
  tileArrow: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 16, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  formTitle: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3, marginBottom: 16 },
  recent: { width: 170, backgroundColor: colors.card, borderRadius: 22, padding: 14, gap: 6, borderWidth: 1, borderColor: colors.border },
  recentPhoto: { width: '100%', aspectRatio: 4 / 3, borderRadius: 14 },
});
