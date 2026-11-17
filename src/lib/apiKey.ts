import * as SecureStore from 'expo-secure-store';

const KEY = 'anthropic_api_key';

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null; // Secure storage is unavailable (e.g. web preview).
  }
}

export async function setApiKey(value: string) {
  if (value.trim()) await SecureStore.setItemAsync(KEY, value.trim());
  else await SecureStore.deleteItemAsync(KEY);
}
