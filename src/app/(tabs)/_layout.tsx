import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, glow, gradients } from '@/components/ui';

function TabIcon({ name, focused }: { name: ComponentProps<typeof Ionicons>['name']; focused: boolean }) {
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        ...(focused ? { backgroundImage: gradients.primary, boxShadow: glow } : null),
      }}
    >
      <Ionicons name={name} size={21} color={focused ? '#FFFFFF' : colors.muted} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: colors.bg, backgroundImage: gradients.tabScene },
        tabBarItemStyle: { height: 64, paddingTop: 9 },
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 12),
          marginHorizontal: 20,
          height: 64,
          paddingBottom: 0,
          borderRadius: 32,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: colors.border,
          borderTopColor: colors.border,
          backgroundColor: colors.cardSolid,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Pick', tabBarIcon: ({ focused }) => <TabIcon name="restaurant" focused={focused} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: ({ focused }) => <TabIcon name="heart" focused={focused} /> }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes', tabBarIcon: ({ focused }) => <TabIcon name="book" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} /> }} />
    </Tabs>
  );
}
