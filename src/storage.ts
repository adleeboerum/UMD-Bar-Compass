import AsyncStorage from '@react-native-async-storage/async-storage';

export type HomeLocation = {
  label: string; // what the user typed, e.g. "8000 Baltimore Ave"
  lat: number;
  lng: number;
};

const HOME_KEY = 'barcompass:home';

/** Load the saved home location, or null if none is set. */
export async function loadHome(): Promise<HomeLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(HOME_KEY);
    return raw ? (JSON.parse(raw) as HomeLocation) : null;
  } catch {
    return null;
  }
}

/** Persist the home location. */
export async function saveHome(home: HomeLocation): Promise<void> {
  try {
    await AsyncStorage.setItem(HOME_KEY, JSON.stringify(home));
  } catch {
    // Best-effort; ignore write failures.
  }
}

/** Remove the saved home location. */
export async function clearHome(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HOME_KEY);
  } catch {
    // ignore
  }
}
