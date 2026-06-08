const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

const EARTH_RADIUS_MILES = 3958.8;

/** Great-circle distance between two coordinates, in miles (Haversine). */
export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

/**
 * Initial great-circle bearing from point 1 -> point 2, in degrees.
 * 0 = true north, 90 = east, normalized to [0, 360).
 */
export function bearingDegrees(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Format a distance in miles into a friendly string. */
export function formatDistance(miles: number): string {
  const feet = miles * 5280;
  if (feet < 1000) {
    return `${Math.round(feet)} ft`;
  }
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi`;
}

/**
 * Rough walking ETA for a distance in miles, assuming ~3 mph.
 * Returns a friendly string like "8 min walk" or "1 hr 5 min walk".
 */
export function formatWalkTime(miles: number): string {
  const minutes = Math.round((miles / 3) * 60);
  if (minutes < 1) return 'You’re here';
  if (minutes < 60) return `${minutes} min walk`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem ? `${hrs} hr ${rem} min walk` : `${hrs} hr walk`;
}

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/** Convert a bearing in degrees to a compass label like "NE". */
export function cardinal(bearing: number): string {
  const idx = Math.round(((bearing % 360) + 360) % 360 / 45) % 8;
  return CARDINALS[idx];
}
