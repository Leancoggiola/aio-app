const ACCESS_KEY = 'omni.accessToken';
const REFRESH_KEY = 'omni.refreshToken';

async function getSecureStore() {
  return import('expo-secure-store');
}

export async function getAccessToken(): Promise<string | null> {
  const SecureStore = await getSecureStore();
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  const SecureStore = await getSecureStore();
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  const SecureStore = await getSecureStore();
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
