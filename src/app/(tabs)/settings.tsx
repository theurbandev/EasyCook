import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, View } from 'react-native';
import { Button, Card, Field, PageTitle, Section, Stepper, ToggleRow, colors, s } from '@/components/ui';
import { getApiKey, setApiKey } from '@/lib/apiKey';
import { useStore } from '@/lib/store';

export default function SettingsScreen() {
  const store = useStore();
  const [key, setKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [avoid, setAvoid] = useState(store.settings.avoid);

  useEffect(() => {
    getApiKey().then((k) => setHasKey(!!k));
  }, []);

  async function saveKey() {
    await setApiKey(key);
    setHasKey(!!key.trim());
    setKey('');
    Alert.alert(key.trim() ? 'API key saved' : 'API key removed');
  }

  const ratedCount = Object.keys(store.ratings).length;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <PageTitle title="Settings" />
      <Section title="Your household" hint="Used as the starting point each time">
        <Text style={s.label}>Usually cooking for</Text>
        <Stepper value={store.settings.defaultPeople} onChange={(n) => store.updateSettings({ defaultPeople: n })} max={20} suffix="people" />
        <View style={{ height: 10 }} />
        <ToggleRow label="We have kids" value={store.settings.hasKids} onChange={(v) => store.updateSettings({ hasKids: v })} />
      </Section>

      <Section title="Never suggest" hint="Ingredients nobody will eat, separated by commas">
        <Field
          placeholder="e.g. mushrooms, olives, cilantro"
          value={avoid}
          onChangeText={setAvoid}
          onEndEditing={() => store.updateSettings({ avoid })}
          onBlur={() => store.updateSettings({ avoid })}
        />
      </Section>

      <Section title="AI ideas & recipes">
        <Card>
          <Text style={s.body}>
            {hasKey
              ? '✅ Claude is on. Meal ideas are personalized to your ratings and favorites, and you can generate any recipe.'
              : 'Without a key, ideas come from the built-in meal list. Add an Anthropic API key to get fresh, personalized ideas and generate recipes.'}
          </Text>
          <Text style={[s.muted, { marginTop: 8 }]} onPress={() => Linking.openURL('https://console.anthropic.com/settings/keys')}>
            Get a key at <Text style={{ color: colors.primary }}>console.anthropic.com</Text>. It is stored only on this device in secure storage.
          </Text>
        </Card>
        <Field label={hasKey ? 'Replace key' : 'API key'} placeholder="sk-ant-…" value={key} onChangeText={setKey} autoCapitalize="none" autoCorrect={false} secureTextEntry />
        <View style={[s.row, { gap: 10 }]}>
          <Button title="Save key" onPress={saveKey} disabled={!key.trim()} style={{ flex: 1 }} />
          {hasKey ? <Button title="Remove" variant="danger" onPress={() => { setKey(''); setApiKey('').then(() => setHasKey(false)); }} style={{ flex: 1 }} /> : null}
        </View>
      </Section>

      <Section title="Your data">
        <Text style={[s.muted, { marginBottom: 10 }]}>
          {store.meals.length} favorites · {store.recipes.length} recipes · {ratedCount} rated meals
        </Text>
        <Button
          title="Erase everything"
          icon="trash-outline"
          variant="danger"
          onPress={() =>
            Alert.alert('Erase everything?', 'This deletes all favorites, photos, recipes and ratings on this device.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Erase', style: 'destructive', onPress: () => store.resetAll().then(() => setAvoid('')) },
            ])
          }
        />
      </Section>
    </ScrollView>
  );
}
