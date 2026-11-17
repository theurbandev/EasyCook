import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, gradients } from '@/components/ui';
import { StoreProvider } from '@/lib/store';

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg, backgroundImage: gradients.stackScene },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ title: 'Meal ideas' }} />
        <Stack.Screen name="meal/new" options={{ title: 'Add a favorite', presentation: 'modal' }} />
        <Stack.Screen name="meal/[id]" options={{ title: 'Favorite' }} />
        <Stack.Screen name="recipe/new" options={{ title: 'Recipe', presentation: 'modal' }} />
        <Stack.Screen name="recipe/generate" options={{ title: 'Generate a recipe', presentation: 'modal' }} />
        <Stack.Screen name="recipe/[id]" options={{ title: 'Recipe' }} />
      </Stack>
    </StoreProvider>
  );
}
