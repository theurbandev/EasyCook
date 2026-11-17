import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { Card, colors, s } from '@/components/ui';
import type { AiRecipe } from '@/lib/ai';

export function RecipeView({ recipe, photoUri }: { recipe: AiRecipe; photoUri?: string }) {
  return (
    <View>
      {photoUri ? <Image source={{ uri: photoUri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 22, marginBottom: 16 }} contentFit="cover" /> : null}
      <Text style={s.title}>{recipe.title}</Text>
      <Text style={[s.muted, { marginTop: 4, marginBottom: 14 }]}>
        {[recipe.cuisine, `Prep ${recipe.prepMinutes} min`, `Cook ${recipe.cookMinutes} min`, `Serves ${recipe.servings}`].filter(Boolean).join(' · ')}
      </Text>

      <Card>
        <Text style={[s.sectionTitle]}>Ingredients</Text>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} style={[s.body, { marginBottom: 4 }]}>
            • {ing}
          </Text>
        ))}
      </Card>

      <Card>
        <Text style={s.sectionTitle}>Steps</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 15, width: 20 }}>{i + 1}</Text>
            <Text style={[s.body, { flex: 1 }]}>{step}</Text>
          </View>
        ))}
      </Card>

      {recipe.notes ? (
        <Card>
          <Text style={s.sectionTitle}>Notes</Text>
          <Text style={s.body}>{recipe.notes}</Text>
        </Card>
      ) : null}
    </View>
  );
}
