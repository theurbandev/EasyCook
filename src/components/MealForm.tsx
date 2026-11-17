import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ChipRow, Field, Section, Stars, ToggleRow, colors, s } from '@/components/ui';
import { pickPhoto } from '@/lib/photos';
import { CUISINES, type SavedMeal } from '@/lib/types';

export type MealDraft = Pick<SavedMeal, 'name' | 'cuisine' | 'notes' | 'kidFriendly' | 'photoUri'> & { stars: number };

export function MealForm({ initial, onSubmit, submitLabel }: { initial: MealDraft; onSubmit: (d: MealDraft) => void; submitLabel: string }) {
  const [draft, setDraft] = useState(initial);
  const set = <K extends keyof MealDraft>(k: K, v: MealDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function addPhoto(camera: boolean) {
    const uri = await pickPhoto(camera);
    if (uri) set('photoUri', uri);
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {draft.photoUri ? (
        <Pressable onPress={() => addPhoto(false)}>
          <Image source={{ uri: draft.photoUri }} style={f.photo} contentFit="cover" />
        </Pressable>
      ) : (
        <View style={[f.photo, f.placeholder]}>
          <Ionicons name="image-outline" size={40} color={colors.primary} />
          <Text style={s.muted}>Add a photo of the meal</Text>
        </View>
      )}
      <View style={[s.row, { gap: 10, marginBottom: 20 }]}>
        <Button title="Camera" icon="camera-outline" variant="secondary" onPress={() => addPhoto(true)} style={{ flex: 1 }} />
        <Button title="Library" icon="images-outline" variant="secondary" onPress={() => addPhoto(false)} style={{ flex: 1 }} />
      </View>

      <Field label="Meal name" placeholder="e.g. Grandma's chicken enchiladas" value={draft.name} onChangeText={(t) => set('name', t)} />

      <Section title="How much did the family like it?">
        <Stars value={draft.stars} onChange={(v) => set('stars', v)} size={32} />
      </Section>

      <Section title="Cuisine">
        <ChipRow>
          {CUISINES.filter((c) => c !== 'Any' && c !== 'Asian (any)').map((c) => (
            <Chip key={c} label={c} selected={draft.cuisine === c} onPress={() => set('cuisine', c)} />
          ))}
          <Chip label="Other" selected={draft.cuisine === 'Other'} onPress={() => set('cuisine', 'Other')} />
        </ChipRow>
      </Section>

      <ToggleRow label="Kids liked it" value={draft.kidFriendly} onChange={(v) => set('kidFriendly', v)} />

      <View style={{ height: 12 }} />
      <Field label="Notes" placeholder="Where it's from, tweaks you made, who loved it…" value={draft.notes} onChangeText={(t) => set('notes', t)} multiline />

      <Button title={submitLabel} icon="checkmark" onPress={() => onSubmit({ ...draft, name: draft.name.trim() })} disabled={!draft.name.trim()} />
    </ScrollView>
  );
}

const f = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16, marginBottom: 10 },
  placeholder: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
});
