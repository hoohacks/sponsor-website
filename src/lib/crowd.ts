/**
 * Shapes for the dot crowd behind the page (components/Crowd.tsx). Every dot is
 * one hacker; these helpers say where a dot stands in each formation.
 * All results are fractions of a box (0..1), so the canvas can place them anywhere.
 */

/** A rough outline of the lower 48 states, as [longitude, latitude]. */
const US_OUTLINE: [number, number][] = [
  [-124.7, 48.4], [-122.8, 49.0], [-95.2, 49.0], [-89.5, 48.0], [-84.6, 46.5], [-82.5, 45.3], [-82.4, 43.0],
  [-83.1, 42.0], [-79.0, 42.8], [-79.0, 43.3], [-76.3, 43.6], [-75.0, 45.0], [-71.5, 45.0], [-69.2, 47.4],
  [-67.8, 47.1], [-67.0, 44.8], [-70.2, 43.6], [-70.7, 42.0], [-70.0, 41.7], [-73.7, 40.6], [-74.0, 39.7],
  [-75.5, 38.5], [-75.9, 37.0], [-76.0, 35.2], [-77.9, 33.9], [-81.0, 31.9], [-81.4, 30.5], [-80.0, 26.8],
  [-80.4, 25.2], [-81.8, 26.0], [-82.8, 27.8], [-82.8, 29.2], [-84.0, 30.0], [-85.5, 29.7], [-88.0, 30.3],
  [-89.6, 30.2], [-89.4, 29.0], [-91.3, 29.2], [-93.8, 29.7], [-97.2, 27.8], [-97.2, 25.9], [-99.5, 27.5],
  [-101.4, 29.8], [-103.2, 29.0], [-104.5, 29.7], [-106.5, 31.8], [-108.2, 31.3], [-111.1, 31.3], [-114.8, 32.5],
  [-117.1, 32.5], [-118.5, 34.0], [-120.6, 34.5], [-122.4, 37.2], [-123.8, 39.8], [-124.4, 42.0], [-124.1, 46.2],
];

const WEST = -125;
const EAST = -66.5;
const NORTH = 49.5;
const SOUTH = 24.7;

/** Width divided by height of the map box, so the country isn't stretched. */
export const US_ASPECT = ((EAST - WEST) * Math.cos((38 * Math.PI) / 180)) / (NORTH - SOUTH);

/** Longitude and latitude to a 0..1 position inside the map box. */
export const projectUS = (lon: number, lat: number): [number, number] => [
  (lon - WEST) / (EAST - WEST),
  (NORTH - lat) / (NORTH - SOUTH),
];

const OUTLINE = US_OUTLINE.map(([lon, lat]) => projectUS(lon, lat));

/** Whether a 0..1 map position falls on land (inside the outline). */
export function insideUS(x: number, y: number) {
  let inside = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Charlottesville, where everyone ends up. */
export const CHARLOTTESVILLE = projectUS(-78.48, 38.03);

/** A random spot on land. `random` is injectable so tests are repeatable. */
export function randomUSPoint(random: () => number = Math.random): [number, number] {
  for (let tries = 0; tries < 200; tries++) {
    const x = random();
    const y = random();
    if (insideUS(x, y)) return [x, y];
  }
  return CHARLOTTESVILLE;
}
