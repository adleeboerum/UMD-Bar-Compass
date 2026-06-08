export type Bar = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Short tagline shown under the name in the picker. */
  tag?: string;
};

/** A place the compass can point to — either a bar or the user's saved home. */
export type Destination = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: 'bar' | 'home';
  tag?: string;
};

// College Park, MD bars — mostly along Baltimore Ave / Route 1.
// NOTE: coordinates are approximate. Verify each in Google Maps before sharing
// (right-click the pin -> the lat/lng at the top of the menu copies to clipboard).
export const BARS: Bar[] = [
  { id: "looneys", name: "Looney's Pub", lat: 38.9897, lng: -76.936, tag: "Route 1 staple" },
  { id: "turf", name: "Terrapin Turf", lat: 38.9817, lng: -76.9385, tag: "Game-day bar" },
  { id: "cornerstone", name: "Cornerstone", lat: 38.9805, lng: -76.9388, tag: "Grill & tap" },
  { id: "greenturtle", name: "Green Turtle", lat: 38.9812, lng: -76.9386, tag: "Sports bar" },
  { id: "bentleys", name: "RJ Bentley's", lat: 38.9803, lng: -76.9389, tag: "Terp classic" },
  { id: "hall", name: "The Hall CP", lat: 38.987, lng: -76.9355, tag: "Food hall + bar" },
];
