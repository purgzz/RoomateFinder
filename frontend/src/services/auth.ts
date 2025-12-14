import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@current_user_id";

export async function setCurrentUserId(id: number) {
  await AsyncStorage.setItem(KEY, String(id));
}

export async function getCurrentUserId(): Promise<number | null> {
  const v = await AsyncStorage.getItem(KEY);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function clearCurrentUserId() {
  await AsyncStorage.removeItem(KEY);
}
